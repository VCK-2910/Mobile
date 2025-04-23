// seedMenu.js
const admin = require('firebase-admin')
const serviceAccount = require('../lms-7b724-firebase-adminsdk-fbsvc-e1ed6d8492.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const menuItems = [
  {
    "foodId": 1,
    "namefood": "Steak Thăn Ngoại Bò Sốt Teriyaki",
    "category": "Main",
    "price": 149000,
    "imageUrl": "https://i.ibb.co/GvJYBG0f/Screenshot-2025-04-22-042113.png"
  },
  {
    "foodId": 2,
    "namefood": "Steak Lõi Vai Bò",
    "category": "Main",
    "price": 149000,
    "imageUrl": "https://i.ibb.co/PZ7YgP6T/Screenshot-2025-04-22-042123.png"
  },
  {
    "foodId": 3,
    "namefood": "Cá Hồi Áp Chảo Sốt Cam Cay",
    "category": "Main",
    "price": 199000,
    "imageUrl": "https://i.ibb.co/RTnzNxVj/Screenshot-2025-04-22-042132.png"
  },
  {
    "foodId": 4,
    "namefood": "Lườn Vịt Nướng Khói Sốt Cam Cay",
    "category": "Main",
    "price": 179000,
    "imageUrl": "https://i.ibb.co/XnNVbn9/Screenshot-2025-04-22-042139.png"
  },
  {
    "foodId": 5,
    "namefood": "Cừu Hầm Sốt Vang",
    "category": "Main",
    "price": 249000,
    "imageUrl": "https://i.ibb.co/RkgDRR1K/Screenshot-2025-04-22-042147.png"
  },
  {
    "foodId": 6,
    "namefood": "Mỳ Ý Tươi Sốt Bò Bằm & Phô Mai Ricotta Với Burrata",
    "category": "Main",
    "price": 209000,
    "imageUrl": "https://i.ibb.co/7NVcHthC/Screenshot-2025-04-22-042158.png"
  },
  {
    "foodId": 7,
    "namefood": "Mỳ Spaghetti Hải Sản Với Sốt Tom Yum",
    "category": "Main",
    "price": 189000,
    "imageUrl": "https://i.ibb.co/fdjTnchr/Screenshot-2025-04-22-042204.png"
  },
  {
    "foodId": 8,
    "namefood": "Mỳ Spaghetti Cá Hồi Và Mực Sốt Phô Mai",
    "category": "Main",
    "price": 169000,
    "imageUrl": "https://i.ibb.co/VYmTRd29/Screenshot-2025-04-22-042213.png"
  },
  { 
    "foodId": 9,
    "namefood": "Mỳ Spaghetti Lườn Vịt Khói Với Sốt Phô Mai",
    "category": "Main",
    "price": 149000,
    "imageUrl": "https://i.ibb.co/W4vRyBqb/Screenshot-2025-04-22-042219.png"
  },
  {
    "foodId": 10,
    "namefood": "Steak Thăn Vai Bò Sốt Phô Mai",
    "category": "Main",
    "price": 229000,
    "imageUrl": "https://i.ibb.co/gMbf1JH8/Screenshot-2025-04-22-042053.png"
  },
  {
    "foodId": 11,
    "namefood": "Steak Thăn Vai Bò Sốt Nấm Truffle",
    "category": "Main",
    "price": 229000,
    "imageUrl": "https://i.ibb.co/7dx5n3rR/Screenshot-2025-04-22-042105.png"
  },
  {
    "foodId": 12,
    "namefood": "Steak Thăn Vai Bò Sốt Tiêu Đen",
    "category": "Main",
    "price": 229000,
    "imageUrl": "https://i.ibb.co/5hThsL84/Screenshot-2025-04-22-042100.png"
  },
  {
    "foodId": 13,
    "namefood": "Steak Thăn Ngoại Bò Kobe",
    "category": "Main",
    "price": 249000,
    "imageUrl": "https://i.ibb.co/4y4dpbH/View-menu-MB-final-1-images-2.jpg"
  },
  {
    "foodId": 14,
    "namefood": "Steak Thăn Ngoại Bò Kobe Với Burrata",
    "category": "Main",
    "price": 499000,
    "imageUrl": "https://i.ibb.co/TBpgTXss/Screenshot-2025-04-22-042034.png"
  },
  {
    "foodId": 15,
    "namefood": "Súp Hải Sản",
    "category": "Starter",
    "price": 19000,
    "imageUrl": "https://i.ibb.co/G3TvCS1t/Screenshot-2025-04-22-042348.png"
  },
  {
    "foodId": 16,
    "namefood": "Súp Kem Nấm Truffle",
    "category": "Starter",
    "price": 19000,
    "imageUrl": "https://i.ibb.co/JwTpYGDT/Screenshot-2025-04-22-042339.png"
  },
  {
    "foodId": 17,
    "namefood": "Khẩu Phần Pizza",
    "category": "Pizza",
    "price": 119000,
    "imageUrl": "https://i.ibb.co/nM0Twpmp/Screenshot-2025-04-22-042526.png"
  },
  {
    "foodId": 18,
    "namefood": "Pizza Gặp Nhân Phô Mai & Bò Băm",
    "category": "Pizza",
    "price": 149000,
    "imageUrl": "https://i.ibb.co/nM0Twpmp/Screenshot-2025-04-22-042526.png"
  },
  {
    "foodId": 19,
    "namefood": "Pizza Gặp Nhân Phô Mai, Nấm & Bạc Chi Hun Khói",
    "category": "Pizza",
    "price": 149000,
    "imageUrl": "https://i.ibb.co/nM0Twpmp/Screenshot-2025-04-22-042526.png"
  },
  {
    "foodId": 20,
    "namefood": "Pizza Dứa & Xúc Xích Đế Giòn",
    "category": "Pizza",
    "price": 129000,
    "imageUrl": "https://i.ibb.co/yFZnVxSx/Screenshot-2025-04-22-042603.png"
  },
  {
    "foodId": 21,
    "namefood": "Pizza Đế Giòn Với Sốt Bò Bằm",
    "category": "Pizza",
    "price": 129000,
    "imageUrl": "https://i.ibb.co/hxTYqzWJ/Screenshot-2025-04-22-042552.png"
  },
  {
    "foodId": 22,
    "namefood": "Khoai Tây Chiên",
    "category": "Fries",
    "price": 49000,
    "imageUrl": "https://i.ibb.co/zWMQSrSZ/Screenshot-2025-04-22-042616.png"
  },
  {
    "foodId": 23,
    "namefood": "Cá & Khoai Tây Chiên",
    "category": "Fries",
    "price": 99000,
    "imageUrl": "https://i.ibb.co/fzmDJ2fh/Screenshot-2025-04-22-042625.png"
  },
  {
    "foodId": 24,
    "namefood": "Bánh Mỳ Bơ Tỏi",
    "category": "Fries",
    "price": 49000,
    "imageUrl": "https://i.ibb.co/JRCCK8q3/Screenshot-2025-04-22-042630.png"
  },
  {
    "foodId": 25,
    "namefood": "Xúc Xích Phô Mai",
    "category": "Fries",
    "price": 99000,
    "imageUrl": "https://i.ibb.co/Wvcmx9Nz/Screenshot-2025-04-22-042636.png"
  },
  {
    "foodId": 26,
    "namefood": "Đĩa Đồ Chiên Tồng Hợp",
    "category": "Fries",
    "price": 129000,
    "imageUrl": "https://i.ibb.co/0V8NhNZZ/Screenshot-2025-04-22-042647.png"
  },
  {
    "foodId": 27,
    "namefood": "Gà Chiên Giòn",
    "category": "Fries",
    "price": 99000,
    "imageUrl": "https://i.ibb.co/prfjRfhg/Screenshot-2025-04-22-042651.png"
  },
  {
    "foodId": 28,
    "namefood": "Vang Đỏ Ý - Wine By Glass",
    "category": "Drink",
    "price": 79000,
    "imageUrl": "https://i.ibb.co/YFsvfKp9/Screenshot-2025-04-22-042814.png"
  },
  {
    "foodId": 29,
    "namefood": "Vang Pháp - Vịp Louis Eschenauer",
    "category": "Drink",
    "price": 650000,
    "imageUrl": "https://i.ibb.co/YFsvfKp9/Screenshot-2025-04-22-042814.png"
  },
  {
    "foodId": 30,
    "namefood": "Vang Chile - Kida Cabernet Sauvignon",
    "category": "Drink",
    "price": 450000,
    "imageUrl": "https://i.ibb.co/YFsvfKp9/Screenshot-2025-04-22-042814.png"
  },
  {
    "foodId": 31,
    "namefood": "Bia Sài Gòn",
    "category": "Drink",
    "price": 35000,
    "imageUrl": "https://i.ibb.co/jkCDVCdm/download.jpg"
  },
  {
    "foodId": 32,
    "namefood": "Bia Tiger Crystal",
    "category": "Drink",
    "price": 35000,
    "imageUrl": "https://i.ibb.co/gMrmw685/image.png"
  },
  {
    "foodId": 33,
    "namefood": "Bia Heineken Silver",
    "category": "Drink",
    "price": 40000,
    "imageUrl": "https://i.ibb.co/ZpD1QKyw/bia-heineken-bac-lon-cao-330-ml-2f81e6c842504c869663d5162e95b4fa.webp"
  },
  {
    "foodId": 34,
    "namefood": "Aquafina",
    "category": "Drink",
    "price": 25000,
    "imageUrl": "https://i.ibb.co/MxGvGvLS/nuoc-aquafina-1-5-lit-1500ml-imana190824-1.jpg"
  },
  {
    "foodId": 35,
    "namefood": "Aquafina Soda",
    "category": "Drink",
    "price": 25000,
    "imageUrl": "https://i.ibb.co/cS419zhj/nuoc-giai-khat-co-ga-aquafina-soda-320ml-202106230911134921.jpg"
  },
  {
    "foodId": 36,
    "namefood": "7 Up",
    "category": "Drink",
    "price": 25000,
    "imageUrl": "https://i.ibb.co/gCVPsWv/image.png"
  },
  {
    "foodId": 37,
    "namefood": "Pepsi",
    "category": "Drink",
    "price": 25000,
    "imageUrl": "https://i.ibb.co/VYFG8bJT/image.png"
  },
  {
    "foodId": 38,
    "namefood": "Pepsi Black",
    "category": "Drink",
    "price": 25000,
    "imageUrl": "https://i.ibb.co/1fzfRDqG/196-ngk-pepsi-zero-calo-330ml-01-copy-99944672a2e0424e99ee4a526150650b-7a52f3ff6ff243b599a07a7304222.jpg"
  },
  {
    "foodId": 39,
    "namefood": "Kombucha Hoa Hibiscus",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/kvSyR6C/Screenshot-2025-04-22-042754.png"
  },
  {
    "foodId": 40,
    "namefood": "Kombucha Gừng Mật Ong",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/bMqR5ZRH/Screenshot-2025-04-22-042746.png"
  },
  {
    "foodId": 41,
    "namefood": "Trà Ổi Hồng Chanh Mật Ong",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/6cJxvX9S/Screenshot-2025-04-22-042759.png"
  },
  {
    "foodId": 42,
    "namefood": "Trà Đào Cam Sả",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/6cJxvX9S/Screenshot-2025-04-22-042759.png"
  },
  {
    "foodId": 43,
    "namefood": "Trà Dứa Gừng",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/bMqR5ZRH/Screenshot-2025-04-22-042746.png"
  },
  {
    "foodId": 44,
    "namefood": "Dứa & Dưa Chuột",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/PZPghNk7/Screenshot-2025-04-22-042729.png"
  },
  {
    "foodId": 45,
    "namefood": "Dứa & Cóc",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/PZPghNk7/Screenshot-2025-04-22-042729.png"
  },
  {
    "foodId": 46,
    "namefood": "Dứa & Dâu",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/PZPghNk7/Screenshot-2025-04-22-042729.png"
  },
  {
    "foodId": 47,
    "namefood": "Nước Ép Cam",
    "category": "Drink",
    "price": 49000,
    "imageUrl": ""
  },
  {
    "foodId": 48,
    "namefood": "Nước Ép Dưa Hấu",
    "category": "Drink",
    "price": 45000,
    "imageUrl": ""
  },
  {
    "foodId": 49,
    "namefood": "Nước Ép Dứa",
    "category": "Drink",
    "price": 45000,
    "imageUrl": ""
  },
  {
    "foodId": 50,
    "namefood": "Nước Chanh Leo",
    "category": "Drink",
    "price": 45000,
    "imageUrl": ""
  },
  {
    "foodId": 51,
    "namefood": "Mojito Dưa Chuột",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/67M8SwnY/Screenshot-2025-04-22-042738.png"
  },
  {
    "foodId": 52,
    "namefood": "Mojito Chanh Leo",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/67M8SwnY/Screenshot-2025-04-22-042738.png"
  },
  {
    "foodId": 53,
    "namefood": "Sparkling Hoa Quả Nhiệt Đới",
    "category": "Drink",
    "price": 59000,
    "imageUrl": "https://i.ibb.co/67M8SwnY/Screenshot-2025-04-22-042738.png"
  },
  {
    "foodId": 54,
    "namefood": "Sangria Táo Quế",
    "category": "Drink",
    "price": 69000,
    "imageUrl": "https://i.ibb.co/0Vv8Lc5m/Screenshot-2025-04-22-042806.png"
  },
  {
    "foodId": 55,
    "namefood": "Sangria Ổi Hồng Đậu Biếc",
    "category": "Drink",
    "price": 119000,
    "imageUrl": "https://i.ibb.co/0Vv8Lc5m/Screenshot-2025-04-22-042806.png"
  },
  {
    "foodId": 56,
    "namefood": "Sangria Hoa Quả Nhiệt Đới",
    "category": "Drink",
    "price": 219000,
    "imageUrl": "https://i.ibb.co/0Vv8Lc5m/Screenshot-2025-04-22-042806.png"
  },
  {
    "foodId": 57,
    "namefood": "Salad Caesar Thượng Hạng",
    "category": "Salad",
    "price": 109000,
    "imageUrl": "https://i.ibb.co/p6n2LpFc/Screenshot-2025-04-22-042455.png"
  },
  {
    "foodId": 58,
    "namefood": "Salad Rau Bốn Mùa",
    "category": "Salad",
    "price": 79000,
    "imageUrl": "https://i.ibb.co/v6phXWyX/Screenshot-2025-04-22-042505.png"
  },
  {
    "foodId": 59,
    "namefood": "Salad Lườn Vịt Hun Khói & Rau Rocket",
    "category": "Salad",
    "price": 129000,
    "imageUrl": "https://i.ibb.co/r2r7ZymQ/Screenshot-2025-04-22-042445.png"
  },
  {
    "foodId": 60,
    "namefood": "Salad Hoa Quả Theo Mùa Với Burrata",
    "category": "Salad",
    "price": 219000,
    "imageUrl": "https://i.ibb.co/C35qpy7f/Screenshot-2025-04-22-042439.png"
  },
  {
    "foodId": 61,
    "namefood": "Lườn Vịt Hun Khói",
    "category": "Starter",
    "price": 119000,
    "imageUrl": "https://i.ibb.co/vCPjbpKD/Screenshot-2025-04-22-042517.png"
  },
  {
    "foodId": 62,
    "namefood": "Mỳ Ý Tươi Sốt Bò Bằm & Phô Mai Ricotta",
    "category": "Pasta",
    "price": 119000,
    "imageUrl": "https://i.ibb.co/209nGHk7/Screenshot-2025-04-22-042253.png"
  },
  {
    "foodId": 63,
    "namefood": "Mỳ Ý Tươi Sốt Kem Nấm & Trứng Trần",
    "category": "Pasta",
    "price": 119000,
    "imageUrl": "https://i.ibb.co/x8YqY279/Screenshot-2025-04-22-042300.png"
  },
  {
    "foodId": 64,
    "namefood": "Mỳ Spaghetti Sốt Bò Bằm & Phô Mai Ricotta",
    "category": "Pasta",
    "price": 119000,
    "imageUrl": "https://i.ibb.co/8nhjYdNH/Screenshot-2025-04-22-042316.png"
  },
  {
    "foodId": 65,
    "namefood": "Mỳ Spaghetti Sốt Kem Nấm & Trứng Trần",
    "category": "Pasta",
    "price": 119000,
    "imageUrl": "https://i.ibb.co/5xgsDDGB/Screenshot-2025-04-22-042309.png"
  },
  {
    "foodId": 66,
    "namefood": "Mỳ Nui Phô Mai Sốt Bò Bằm Bò Lớn",
    "category": "Pasta",
    "price": 119000,
    "imageUrl": "https://i.ibb.co/jPmpgm9G/Screenshot-2025-04-22-042230.png"
  },
  {
    "foodId": 67,
    "namefood": "Mỳ Nui Phô Mai Tôm Bò Lớn",
    "category": "Pasta",
    "price": 139000,
    "imageUrl": "https://i.ibb.co/FqhZhL43/Screenshot-2025-04-22-042237.png"
  },
  {
    "foodId": 68,
    "namefood": "Mỳ Spaghetti Nấm & Cá Chua Với Sốt Phô Mai",
    "category": "Pasta",
    "price": 119000,
    "imageUrl": "https://i.ibb.co/kg2kxh6M/Screenshot-2025-04-22-042245.png"
  },
  {
    "foodId": 69,
    "namefood": "Súp Hải Sản",
    "category": "Starter",
    "price": 49000,
    "imageUrl": "https://i.ibb.co/G3TvCS1t/Screenshot-2025-04-22-042348.png"
  },
  {
    "foodId": 70,
    "namefood": "Súp Kem Nấm Truffle",
    "category": "Starter",
    "price": 49000,
    "imageUrl": "https://i.ibb.co/JwTpYGDT/Screenshot-2025-04-22-042339.png"
  },
  {
    "foodId": 71,
    "namefood": "Súp Kem Bi Đỏ",
    "category": "Starter",
    "price": 19000,
    "imageUrl": "https://i.ibb.co/6c8cpFGc/Screenshot-2025-04-22-042412.png"
  }
]

async function seed() {
  const batch = db.batch()
  menuItems.forEach(item => {
    const ref = db.collection('menu').doc()  // hoặc .doc(item.namefood) nếu muốn ID có nghĩa
    batch.set(ref, item)
  })
  await batch.commit()
  console.log('✅ Seed completed.')
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
