from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
# Create your tests here.
"""
Login test requirements:
1. Successful Login
2. Unsuccessful Login
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