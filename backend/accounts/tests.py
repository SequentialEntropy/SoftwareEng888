from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.core import mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
# Create your tests here.
"""
Tests:
1. Login: login success, login fail
2. Password Reset: views rendered correctly and the entire password reset flow
"""
class LoginTest(TestCase):
    def setUp(self):
        """
        Set up test data. This method is called before each test.
        """
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpass%123')

    def test_login_success(self):
        """
        Test successful login.
        """
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'testpass%123'})
        self.assertEqual(response.status_code, 302)  # Check for redirect after successful login
        self.assertRedirects(response, reverse('home'))

    def test_login_fail(self):
        """
        Test unsuccessful login.
        """
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'wrongpass123'})
        self.assertEqual(response.status_code, 200)  # Check for unsuccessful login
        self.assertContains(response, 'Please enter a correct username and password.')

class PasswordResetTest(TestCase):
    def setUp(self):
        """
        Set up account test
        """
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpass%123'
        )
        self.password_reset_url = reverse('password_reset')
        self.password_reset_done_url = reverse('password_reset_done')
        self.password_reset_confirm_url = reverse('password_reset_confirm', kwargs={'uidb64': 'uidb64', 'token': 'token'})
        self.password_reset_complete_url = reverse('password_reset_complete')

    def test_password_reset_view(self):
        """
        Test password reset view renders correctly.
        """
        response = self.client.get(self.password_reset_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/password_reset_form.html')

    def test_password_reset_form_submission(self):
        """
        Test password submission reset form sends an email.
        """
        response = self.client.post(self.password_reset_url, {'email': self.user.email})
        self.assertEqual(response.status_code, 302)  # Check for redirect after form submission
        self.assertRedirects(response, self.password_reset_done_url)

        # Check that an email was sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(self.user.email, mail.outbox[0].to)

    def test_password_reset_confirm_view(self):
        """
        Test confirmation view works correctly.
        """
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)

        # Access the password reset confirm page
        response = self.client.get(reverse('password_reset_confirm', kwargs={'uidb64': uidb64, 'token': token}))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('password_reset_confirm', kwargs={'uidb64': uidb64, 'token': 'set-password'}))

    def test_password_reset_complete_view(self):
        """
        Test password reset complete view renders correctly.
        """
        response = self.client.get(self.password_reset_complete_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/password_reset_complete.html')

    def test_password_reset(self):
        """
        Test entire password reset flow:
        """
        response = self.client.post(self.password_reset_url, {'email': self.user.email})
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, self.password_reset_done_url)
        self.assertEqual(len(mail.outbox), 1)
        email_body = mail.outbox[0].body
        reset_link = [line for line in email_body.splitlines() if 'http://testserver' in line][0]
        response = self.client.get(reset_link, follow=True)
        self.assertEqual(response.status_code, 200)
        new_password = 'newpass%123'
        response = self.client.post(
            response.request['PATH_INFO'],
            {'new_password1': new_password, 'new_password2': new_password}
        )
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, self.password_reset_complete_url)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(new_password))