from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.core import mail
from .models import UserGameStats
import json
# Create your tests here.
"""
Tests:
1. Login Tests: Login Template Load, Login Success, Login Failure
2. Password Reset Tests: Password Reset Template Load, Password Reset Success, Password Reset Failure
3. Signup Tests: Signup Template Load, Signup Success, Signup Failure
"""
#9/9 tests passed
class LoginTest(TestCase):
    def setUp(self):
        """
        Set up test data
        """
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpass%123')

    def test_login_view_get(self):
        """
        Test login template loads correctly
        """
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/login.html')

    def test_login_success(self):
        """
        Test login success
        """
        response = self.client.post(reverse('login'), {
            'username': 'testuser',
            'password': 'testpass%123',
        })
        self.assertRedirects(response, reverse('home'))

    def test_login_failure(self):
        """
        Test login failure
        """
        response = self.client.post(reverse('login'), {
            'username': 'testuser',
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Please enter a correct username or password.")


class PasswordResetTests(TestCase):
    def setUp(self):
        """
        Set up test data
        """
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='12345')

    def test_password_reset_view_get(self):
        """
        Test password reset page loads correctly
        """
        response = self.client.get(reverse('password_reset'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/password_reset_form.html')

    def test_password_reset_post_success(self):
        """
        Test successful POST request
        """
        response = self.client.post(reverse('password_reset'), {'email': 'test@example.com'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Password reset on testserver')

    def test_password_reset_post_failure(self):
        """
        Test failed POST request
        """
        response = self.client.post(reverse('password_reset'), {'email': 'wrong@example.com'})
        self.assertEqual(response.status_code, 302)  # Expect a redirect
        follow_response = self.client.get(response.url)  # Follow the redirect
        self.assertEqual(follow_response.status_code, 200)  # Ensure the redirected page loads
        self.assertTemplateUsed(follow_response, 'registration/password_reset_done.html')

class SignupTests(TestCase):
    def setUp(self):
        """
        Set up test data
        """
        self.client = Client()

    def test_signup_view_get(self):
        """
        Test signup page loads correctly
        """
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)  # Expect 200 OK
        self.assertTemplateUsed(response, 'registration/signup.html')

    def test_signup_success(self):
        """
        Test successful signup request
        """
        data = {
            'username': 'newuser',
            'password': 'complexpassword123',
        }
        response = self.client.post(
            reverse('register'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)  # 201 Created for successful POST
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_signup_failure(self):
        """
        Test failed signup request
        """
        data = {
            'username': '',  # Invalid username
            'password': 'complexpassword123',
        }
        response = self.client.post(
            reverse('register'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)  # 400 Bad Request

class UserGameStatsTests(TestCase):
    def setUp(self):
        """
        Set up test data
        """
        self.client = Client()
        self.user = User.objects.create_user(username="player1", password="complexpassword123")
        self.user_stats = UserGameStats.objects.create(user=self.user, score=0)

    def test_user_score_stored(self):
        """
        Test for UserGameStats object starts with a default score of 0 after a user is created.
        """
        user_stats = UserGameStats.objects.get(user=self.user)
        self.assertEqual(user_stats.score, 0)

    def test_update_user_score(self):
        """
        Test updating the user's score and the change is stored in the database.
        """
        user_stats = UserGameStats.objects.get(user=self.user)
        user_stats.score = 50
        user_stats.save()

        updated_stats = UserGameStats.objects.get(user=self.user)
        self.assertEqual(updated_stats.score, 50)
        self.assertEqual(response.status_code, 400)  # 400 Bad Request for invalid data

class UserGameStatsTests(TestCase):
    def setUp(self):
        """
        Set up test data
        """
        self.client = Client()
        self.user = User.objects.create_user(username="player1", password="complexpassword123")
        self.user_stats = UserGameStats.objects.create(user=self.user, score=0)

    def test_user_score_stored(self):
        """
        Test for UserGameStats object starts with a default score of 0 after a user is created.
        """
        user_stats = UserGameStats.objects.get(user=self.user)
        self.assertEqual(user_stats.score, 0)

    def test_update_user_score(self):
        """
        Test updating the user's score and the change is stored in the database.
        """
        user_stats = UserGameStats.objects.get(user=self.user)
        user_stats.score = 50
        user_stats.save()

        updated_stats = UserGameStats.objects.get(user=self.user)
        self.assertEqual(updated_stats.score, 50)