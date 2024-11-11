Kurulum:

Üç dizine de sırasıyla npm install yapmanız gerekiyor.
npm install
cd backend npm install
cd frontend npm install

.env dosyasında
MONGO_URI=
REACT_APP_GOOGLE_MAPS_API=
GOOGLE_MAPS_API_KEY=
REACT_APP_GOOGLE_MAPS_API_KEY=
YOUTUBE_API_KEY=

doldurulması gereken yerler.
Google cloudtan google maps için ve Youtube için api alınması gerekiyor.
Recaptcha olan yerlerde de Recaptcha için api alınması gerekiyor.

nodemon backend/seeder.js - bu kod üç tane admin kullanıcı ekleyecek. Çalıştırdıktan sonra serverı kapatıp npm run dev ile tekrar çalıştırmak gerekiyor.
Bu üç kullanıcı:
{
name: "Admin User 1",
email: "admin1@example.com",
password: "admin123"
isAdmin: true,
profileImage: "path/to/image1.png",
lastLoginTime: new Date(),
},
{
name: "Admin User 2",
email: "admin2@example.com",
password: "admin123"
isAdmin: true,
profileImage: "path/to/image2.png",
lastLoginTime: new Date(),
},
{
name: "Admin User 3",
email: "admin3@example.com",
password: "admin123"
isAdmin: true,
profileImage: "path/to/image3.png",
lastLoginTime: new Date(),
},

http://localhost:3000/mehmet123 - Login sayfası linki

AddRestaurant.jsx, AdminRestaurantEdit.jsx ve RestaurantScreen.js dosyaları içersinde google maps api girme kısmı var.

LoginForm.jsx te Recaptcha api girme yeri var.
