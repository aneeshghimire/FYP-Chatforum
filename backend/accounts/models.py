from PIL import Image, ImageOps
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    def __str__(self):
        return self.user.username
    
    def save(self, *args, **kwargs):
        if self.profile_picture:
            # Open the uploaded image using Pillow
            img = Image.open(self.profile_picture)

            # Resize the image to a fixed size while maintaining aspect ratio
            img = ImageOps.fit(img, (200, 200), Image.Resampling.LANCZOS)

            # Save the image as PNG
            output = BytesIO()
            img.save(output, format='PNG')  # Save as PNG
            output.seek(0)

            # Replace the existing image with the processed one
            self.profile_picture = InMemoryUploadedFile(
                output, 
                'ImageField', 
                f"{self.profile_picture.name.split('.')[0]}.png",  # Use .png extension
                'image/png', 
                output.getbuffer().nbytes, 
                None
            )

        super().save(*args, **kwargs)


