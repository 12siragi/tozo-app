import logging
import json
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from allauth.socialaccount.models import SocialAccount, SocialToken
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.tokens import default_token_generator
from .serializers import UserDetailSerializer

from .serializers import RegisterSerializer, LoginSerializer, PasswordResetSerializer, PasswordChangeSerializer

UserModel = get_user_model()

# Set up logging
logger = logging.getLogger(__name__)

# User Registration View
class UserRegistrationAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Create the user
            refresh = RefreshToken.for_user(user)  # Generate refresh token
            data = serializer.data
            data['tokens'] = {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
            # Send email verification
            self.send_verification_email(user)
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_verification_email(self, user):
        token = default_token_generator.make_token(user)
        verification_url = f"http://localhost:8000/api/verify-email/?token={token}&email={user.email}"
        send_mail(
            'Verify Your Email',
            f'Click the link below to verify your email:\n{verification_url}',
            'no-reply@example.com',
            [user.email],
            fail_silently=False,
        )
        logger.info(f"Verification email sent to {user.email}")

# User Login View
class UserLoginAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            tokens = serializer.validated_data
            return Response(tokens, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Password Reset View
class PasswordResetAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            token = default_token_generator.make_token(UserModel.objects.get(email=email))  # Generate the reset token
            reset_url = f"http://localhost:8000/api/reset-password/?token={token}&email={email}"
            send_mail(
                'Password Reset Request',
                f'Click the link below to reset your password:\n{reset_url}',
                'no-reply@example.com',
                [email],
                fail_silently=False,
            )
            return Response({
                "message": "Password reset email has been sent."
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Password Change View
class PasswordChangeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordChangeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Change the user's password
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({
                "message": "Password changed successfully."
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Google Login Callback View
def google_login_callback(request):
    user = request.user
    try:
        social_account = SocialAccount.objects.get(user=user)
        token = SocialToken.objects.get(account=social_account, account__provider='google')

        # Generate refresh and access tokens for the user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')
    
    except SocialAccount.DoesNotExist:
        logger.error(f"Google login callback failed for user {user}: No social account found.")
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')
    
    except SocialToken.DoesNotExist:
        logger.error(f"Google login callback failed for user {user}: No Google token found.")
        return redirect(f'http://localhost:5173/login/callback/?error=NoGoogleToken')
    
    except Exception as e:
        logger.error(f"Unexpected error in Google login callback for user {user}: {str(e)}")
        return redirect(f'http://localhost:5173/login/callback/?error=InternalError')

# Validate Google Token Endpoint
@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')

            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing.'}, status=400)

            # Here you can verify the Google token with Google's API if needed
            # For now, just assume the token is valid
            return JsonResponse({'valid': True})
        
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
        except Exception as e:
            logger.error(f"Error while validating Google token: {str(e)}")
            return JsonResponse({'detail': 'Internal server error.'}, status=500)

    return JsonResponse({'detail': 'Method not allowed.'}, status=405)

# Email Verification View
class EmailVerificationAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.query_params.get('token')  # Change to query_params
        email = request.query_params.get('email')  # Change to query_params

        if not token or not email:
            return Response({"detail": "Token or email missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = True
        user.save()

        return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)

# User Detail API View
class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailSerializer

    def get(self, request, *args, **kwargs):
        """
        Get the details of the authenticated user.
        """
        user = request.user
        serializer = self.serializer_class(user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        """
        Update the details of the authenticated user.
        """
        user = request.user
        serializer = self.serializer_class(user, data=request.data, partial=True)  # partial=True allows updating only part of the data
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
