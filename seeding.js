require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const fs = require("fs");
const User = require("./model/userSchema");
const Product = require("./model/productSchema");
const Cart = require("./model/cartSchema");
const Order = require("./model/orderSchema");
const Category = require("./model/categorySchema");
mongoose.connect(process.env.DB_URL);

function genRandom(lowLimit, highLimit) {
  return Math.floor(Math.random() * highLimit + lowLimit);
}

const categories = [
  { name: "T-Shirts" },
  { name: "Jeans" },
  { name: "Jackets" },
  { name: "Dresses" },
  { name: "Sweaters" },
  { name: "Shorts" },
  { name: "Hoodies" },
];

const reviews = [
  {
    rating: 5,
    review:
      "An exceptional course with clear explanations and practical exercises. It exceeded my expectations.",
  },
  {
    rating: 4,
    review:
      "Well-structured and informative. Some areas could use more depth, but overall a great learning experience.",
  },
  {
    rating: 5,
    review:
      "The best course I've taken! The instructor's expertise and the detailed content made complex topics easy to understand.",
  },
  {
    rating: 3,
    review:
      "The course was decent but lacked engagement. More interactive elements would enhance the learning experience.",
  },
  {
    rating: 4,
    review:
      "A solid course that provides a good foundation. The real-world examples were especially helpful.",
  },
  {
    rating: 5,
    review:
      "Highly recommended! The course material was well-organized and the instructor was very knowledgeable.",
  },
  {
    rating: 4,
    review:
      "The course covered a lot of material, but a few topics could have been explained in more detail.",
  },
  {
    rating: 5,
    review:
      "Fantastic course! The hands-on projects and quizzes really helped reinforce the concepts learned.",
  },
  {
    rating: 3,
    review:
      "Useful content, but the course could benefit from a faster pace and more engaging delivery.",
  },
  {
    rating: 4,
    review:
      "Good course overall. The instructor was clear and concise, though some areas felt a bit rushed.",
  },
  {
    rating: 5,
    review:
      "Incredible course with practical insights and clear instruction. I learned a lot and feel confident in the subject.",
  },
  {
    rating: 4,
    review:
      "Very informative with practical examples. A few more advanced topics would be a great addition.",
  },
  {
    rating: 5,
    review:
      "Excellent course! The material was well-organized and the instructor provided valuable feedback.",
  },
  {
    rating: 3,
    review:
      "The course was okay but lacked depth in some areas. More detailed explanations would be helpful.",
  },
  {
    rating: 4,
    review:
      "Great course with a lot of valuable information. The pacing was good, but some sections could use more examples.",
  },
  {
    rating: 5,
    review:
      "One of the best courses I've taken. The content was relevant and the teaching style was engaging.",
  },
  {
    rating: 4,
    review:
      "Good course with clear explanations. Additional interactive elements would improve the overall experience.",
  },
  {
    rating: 5,
    review:
      "Outstanding course! The practical projects were very helpful in applying the concepts learned.",
  },
  {
    rating: 3,
    review:
      "The course was useful but needed more detailed explanations and examples for better understanding.",
  },
  {
    rating: 4,
    review:
      "A comprehensive course with useful content. The instructor was knowledgeable, though some topics were a bit brief.",
  },
  {
    rating: 5,
    review:
      "Excellent course! The content was well-structured and the instructor's expertise was evident.",
  },
  {
    rating: 4,
    review:
      "Very good course. The material was relevant, but a few sections could have been more engaging.",
  },
  {
    rating: 5,
    review:
      "An exceptional learning experience! The course was well-organized and provided in-depth knowledge on the topic.",
  },
  {
    rating: 3,
    review:
      "The course was adequate but lacked interactive components. More hands-on activities would be beneficial.",
  },
  {
    rating: 4,
    review:
      "Good course with practical examples. The pacing was generally good, though some sections felt a bit slow.",
  },
  {
    rating: 5,
    review:
      "Fantastic course! The instructor was engaging, and the content was highly relevant and useful.",
  },
  {
    rating: 4,
    review:
      "Great course overall. Some topics were covered in more detail than others, but it was very informative.",
  },
  {
    rating: 5,
    review:
      "Highly recommend this course! The clear explanations and practical exercises made learning enjoyable.",
  },
  {
    rating: 3,
    review:
      "The course provided useful information but lacked depth in certain areas. More detailed content would be helpful.",
  },
  {
    rating: 4,
    review:
      "A solid course with good content. The pace was good, but a few more interactive elements would enhance learning.",
  },
  {
    rating: 5,
    review:
      "Incredible course with detailed content and practical applications. The instructor did an excellent job.",
  },
  {
    rating: 4,
    review:
      "Very good course with useful material. A few more examples and hands-on activities would improve it further.",
  },
  {
    rating: 5,
    review:
      "Exceptional course! The instructor was knowledgeable, and the content was well-organized and relevant.",
  },
  {
    rating: 3,
    review:
      "The course was helpful but needed more engaging content and practical examples to reinforce learning.",
  },
  {
    rating: 4,
    review:
      "Great course with practical insights. The material was well-presented, though some topics could be more detailed.",
  },
  {
    rating: 5,
    review:
      "Excellent course! The content was clear, and the projects were highly beneficial for applying what was learned.",
  },
  {
    rating: 4,
    review:
      "A good course overall. The material was useful, but a few more interactive elements would enhance the experience.",
  },
  {
    rating: 5,
    review:
      "Highly recommended! The course was well-organized, and the instructor's teaching style was very effective.",
  },
  {
    rating: 3,
    review:
      "The course covered basic concepts but lacked depth in some areas. More detailed content would be useful.",
  },
  {
    rating: 4,
    review:
      "Good course with relevant information. The pace was steady, though some sections could be more engaging.",
  },
  {
    rating: 5,
    review:
      "Fantastic learning experience! The course was well-structured, and the practical exercises were very helpful.",
  },
  {
    rating: 4,
    review:
      "Very informative course. The material was relevant, though some sections felt a bit rushed.",
  },
  {
    rating: 5,
    review:
      "An outstanding course with clear explanations and practical applications. I feel much more confident in the subject.",
  },
  {
    rating: 3,
    review:
      "The course was decent but could benefit from more interactive content and practical examples.",
  },
  {
    rating: 4,
    review:
      "Good course with useful material. A few more examples and hands-on activities would make it even better.",
  },
  {
    rating: 5,
    review:
      "Excellent course! The content was detailed, and the instructor provided valuable feedback throughout.",
  },
  {
    rating: 4,
    review:
      "Great course overall. The material was useful, but a few more interactive elements would enhance the experience.",
  },
  {
    rating: 5,
    review:
      "Highly recommend this course! The instructor was engaging, and the content was relevant and practical.",
  },
  {
    rating: 3,
    review:
      "The course provided basic information but lacked depth in certain areas. More detailed content would be beneficial.",
  },
  {
    rating: 4,
    review:
      "A solid course with practical insights. The pacing was good, though some sections could use more detail.",
  },
  {
    rating: 5,
    review:
      "Fantastic course with clear instruction and valuable content. The practical projects were especially helpful.",
  },
  {
    rating: 4,
    review:
      "Good course with useful material. The instructor was knowledgeable, but a few more examples would improve it.",
  },
  {
    rating: 5,
    review:
      "Exceptional learning experience! The course was well-organized, and the content was highly relevant.",
  },
  {
    rating: 3,
    review:
      "The course was okay but needed more interactive elements and detailed explanations for better understanding.",
  },
  {
    rating: 4,
    review:
      "Great course with practical examples. The content was useful, though a few more advanced topics would be helpful.",
  },
  {
    rating: 5,
    review:
      "Highly recommend this course! The instructor's expertise and the well-structured content made learning enjoyable.",
  },
  {
    rating: 4,
    review:
      "A good course overall. The material was useful, but some sections felt a bit rushed and could use more detail.",
  },
];

const products = [
  // T-Shirts
  {
    name: "Graphic Tee",
    description: "A stylish graphic tee for casual wear.",
    category: "T-Shirts",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Black",
        colorHex: "#000000",
        size: "M",
        stock: 20,
        price: 29.99,
        image: "http://example.com/image1.jpg",
      },
      {
        color: "White",
        colorHex: "#FFFFFF",
        size: "L",
        stock: 15,
        price: 29.99,
        image: "http://example.com/image2.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "V-Neck Tee",
    description: "A comfortable v-neck tee for everyday use.",
    category: "T-Shirts",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Gray",
        colorHex: "#808080",
        size: "S",
        stock: 10,
        price: 24.99,
        image: "http://example.com/image3.jpg",
      },
      {
        color: "Blue",
        colorHex: "#0000FF",
        size: "M",
        stock: 12,
        price: 24.99,
        image: "http://example.com/image4.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Striped Tee",
    description: "A classic striped tee for a trendy look.",
    category: "T-Shirts",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Navy",
        colorHex: "#003366",
        size: "M",
        stock: 18,
        price: 27.99,
        image: "http://example.com/image5.jpg",
      },
      {
        color: "Red",
        colorHex: "#FF0000",
        size: "L",
        stock: 14,
        price: 27.99,
        image: "http://example.com/image6.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Basic Tee",
    description: "A simple and versatile basic tee.",
    category: "T-Shirts",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Beige",
        colorHex: "#F5F5DC",
        size: "S",
        stock: 22,
        price: 19.99,
        image: "http://example.com/image7.jpg",
      },
      {
        color: "Green",
        colorHex: "#008000",
        size: "M",
        stock: 16,
        price: 19.99,
        image: "http://example.com/image8.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Pocket Tee",
    description: "A tee with a stylish pocket detail.",
    category: "T-Shirts",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Charcoal",
        colorHex: "#36454F",
        size: "L",
        stock: 20,
        price: 34.99,
        image: "http://example.com/image9.jpg",
      },
      {
        color: "Olive",
        colorHex: "#808000",
        size: "XL",
        stock: 10,
        price: 34.99,
        image: "http://example.com/image10.jpg",
      },
    ],
    attributes: [],
  },

  // Jeans
  {
    name: "Skinny Jeans",
    description: "Form-fitting skinny jeans with a modern look.",
    category: "Jeans",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Dark Blue",
        colorHex: "#003366",
        size: "30",
        stock: 15,
        price: 49.99,
        image: "http://example.com/image11.jpg",
      },
      {
        color: "Black",
        colorHex: "#000000",
        size: "32",
        stock: 12,
        price: 49.99,
        image: "http://example.com/image12.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Straight Leg Jeans",
    description: "Classic straight-leg jeans for a relaxed fit.",
    category: "Jeans",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Light Blue",
        colorHex: "#ADD8E6",
        size: "32",
        stock: 18,
        price: 54.99,
        image: "http://example.com/image13.jpg",
      },
      {
        color: "Medium Wash",
        colorHex: "#4682B4",
        size: "34",
        stock: 16,
        price: 54.99,
        image: "http://example.com/image14.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Bootcut Jeans",
    description: "Stylish bootcut jeans with a slight flare.",
    category: "Jeans",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Black",
        colorHex: "#000000",
        size: "30",
        stock: 14,
        price: 59.99,
        image: "http://example.com/image15.jpg",
      },
      {
        color: "Dark Wash",
        colorHex: "#003366",
        size: "32",
        stock: 12,
        price: 59.99,
        image: "http://example.com/image16.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Distressed Jeans",
    description: "Jeans with a trendy distressed look.",
    category: "Jeans",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Light Blue",
        colorHex: "#ADD8E6",
        size: "28",
        stock: 20,
        price: 64.99,
        image: "http://example.com/image17.jpg",
      },
      {
        color: "Gray",
        colorHex: "#808080",
        size: "30",
        stock: 18,
        price: 64.99,
        image: "http://example.com/image18.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "High-Waisted Jeans",
    description: "High-waisted jeans for a flattering fit.",
    category: "Jeans",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Black",
        colorHex: "#000000",
        size: "32",
        stock: 16,
        price: 69.99,
        image: "http://example.com/image19.jpg",
      },
      {
        color: "Dark Wash",
        colorHex: "#003366",
        size: "34",
        stock: 14,
        price: 69.99,
        image: "http://example.com/image20.jpg",
      },
    ],
    attributes: [],
  },

  // Jackets
  {
    name: "Leather Jacket",
    description: "A classic leather jacket for a rugged look.",
    category: "Jackets",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Black",
        colorHex: "#000000",
        size: "M",
        stock: 10,
        price: 199.99,
        image: "http://example.com/image21.jpg",
      },
      {
        color: "Brown",
        colorHex: "#8B4513",
        size: "L",
        stock: 8,
        price: 199.99,
        image: "http://example.com/image22.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Denim Jacket",
    description: "A timeless denim jacket for casual style.",
    category: "Jackets",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Light Blue",
        colorHex: "#ADD8E6",
        size: "S",
        stock: 15,
        price: 89.99,
        image: "http://example.com/image23.jpg",
      },
      {
        color: "Dark Blue",
        colorHex: "#003366",
        size: "M",
        stock: 12,
        price: 89.99,
        image: "http://example.com/image24.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Bomber Jacket",
    description: "A stylish bomber jacket with a sleek design.",
    category: "Jackets",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Olive",
        colorHex: "#808000",
        size: "L",
        stock: 10,
        price: 119.99,
        image: "http://example.com/image25.jpg",
      },
      {
        color: "Black",
        colorHex: "#000000",
        size: "XL",
        stock: 8,
        price: 119.99,
        image: "http://example.com/image26.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Puffer Jacket",
    description: "A warm puffer jacket for winter.",
    category: "Jackets",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Red",
        colorHex: "#FF0000",
        size: "L",
        stock: 12,
        price: 139.99,
        image: "http://example.com/image27.jpg",
      },
      {
        color: "Navy",
        colorHex: "#003366",
        size: "XL",
        stock: 10,
        price: 139.99,
        image: "http://example.com/image28.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Trench Coat",
    description: "A classic trench coat for a sophisticated look.",
    category: "Jackets",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Beige",
        colorHex: "#F5F5DC",
        size: "M",
        stock: 14,
        price: 149.99,
        image: "http://example.com/image29.jpg",
      },
      {
        color: "Khaki",
        colorHex: "#F0E68C",
        size: "L",
        stock: 12,
        price: 149.99,
        image: "http://example.com/image30.jpg",
      },
    ],
    attributes: [],
  },

  // Dresses
  {
    name: "Floral Dress",
    description: "A beautiful floral dress for special occasions.",
    category: "Dresses",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Pink",
        colorHex: "#FFC0CB",
        size: "S",
        stock: 20,
        price: 69.99,
        image: "http://example.com/image31.jpg",
      },
      {
        color: "Blue",
        colorHex: "#0000FF",
        size: "M",
        stock: 15,
        price: 69.99,
        image: "http://example.com/image32.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Evening Gown",
    description: "An elegant evening gown for formal events.",
    category: "Dresses",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Red",
        colorHex: "#FF0000",
        size: "M",
        stock: 12,
        price: 149.99,
        image: "http://example.com/image33.jpg",
      },
      {
        color: "Black",
        colorHex: "#000000",
        size: "L",
        stock: 10,
        price: 149.99,
        image: "http://example.com/image34.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Maxi Dress",
    description: "A flowing maxi dress perfect for summer.",
    category: "Dresses",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Yellow",
        colorHex: "#FFFF00",
        size: "S",
        stock: 18,
        price: 79.99,
        image: "http://example.com/image35.jpg",
      },
      {
        color: "Green",
        colorHex: "#008000",
        size: "M",
        stock: 16,
        price: 79.99,
        image: "http://example.com/image36.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Wrap Dress",
    description: "A stylish wrap dress for a flattering fit.",
    category: "Dresses",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Purple",
        colorHex: "#800080",
        size: "M",
        stock: 14,
        price: 89.99,
        image: "http://example.com/image37.jpg",
      },
      {
        color: "Orange",
        colorHex: "#FFA500",
        size: "L",
        stock: 12,
        price: 89.99,
        image: "http://example.com/image38.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Shift Dress",
    description: "A comfortable shift dress for casual outings.",
    category: "Dresses",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "White",
        colorHex: "#FFFFFF",
        size: "S",
        stock: 20,
        price: 59.99,
        image: "http://example.com/image39.jpg",
      },
      {
        color: "Black",
        colorHex: "#000000",
        size: "M",
        stock: 18,
        price: 59.99,
        image: "http://example.com/image40.jpg",
      },
    ],
    attributes: [],
  },

  // Sweaters
  {
    name: "Cable Knit Sweater",
    description: "A cozy cable knit sweater for colder weather.",
    category: "Sweaters",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Cream",
        colorHex: "#FFFDD0",
        size: "M",
        stock: 15,
        price: 89.99,
        image: "http://example.com/image41.jpg",
      },
      {
        color: "Gray",
        colorHex: "#808080",
        size: "L",
        stock: 12,
        price: 89.99,
        image: "http://example.com/image42.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Cardigan",
    description: "A versatile cardigan for layering.",
    category: "Sweaters",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Black",
        colorHex: "#000000",
        size: "S",
        stock: 20,
        price: 79.99,
        image: "http://example.com/image43.jpg",
      },
      {
        color: "Beige",
        colorHex: "#F5F5DC",
        size: "M",
        stock: 18,
        price: 79.99,
        image: "http://example.com/image44.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Crew Neck Sweater",
    description: "A classic crew neck sweater for comfort.",
    category: "Sweaters",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Navy",
        colorHex: "#003366",
        size: "L",
        stock: 14,
        price: 84.99,
        image: "http://example.com/image45.jpg",
      },
      {
        color: "Maroon",
        colorHex: "#800000",
        size: "XL",
        stock: 10,
        price: 84.99,
        image: "http://example.com/image46.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Fleece Pullover",
    description: "A warm fleece pullover for chilly days.",
    category: "Sweaters",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Green",
        colorHex: "#008000",
        size: "M",
        stock: 12,
        price: 99.99,
        image: "http://example.com/image47.jpg",
      },
      {
        color: "Brown",
        colorHex: "#8B4513",
        size: "L",
        stock: 10,
        price: 99.99,
        image: "http://example.com/image48.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Turtleneck Sweater",
    description: "A classic turtleneck sweater for extra warmth.",
    category: "Sweaters",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Charcoal",
        colorHex: "#36454F",
        size: "L",
        stock: 16,
        price: 94.99,
        image: "http://example.com/image49.jpg",
      },
      {
        color: "Taupe",
        colorHex: "#D8BFD8",
        size: "M",
        stock: 14,
        price: 94.99,
        image: "http://example.com/image50.jpg",
      },
    ],
    attributes: [],
  },

  // Shorts
  {
    name: "Denim Shorts",
    description: "Classic denim shorts for warm weather.",
    category: "Shorts",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Light Blue",
        colorHex: "#ADD8E6",
        size: "S",
        stock: 25,
        price: 39.99,
        image: "http://example.com/image51.jpg",
      },
      {
        color: "Dark Blue",
        colorHex: "#003366",
        size: "M",
        stock: 20,
        price: 39.99,
        image: "http://example.com/image52.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Cargo Shorts",
    description: "Functional cargo shorts with plenty of pockets.",
    category: "Shorts",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Olive",
        colorHex: "#808000",
        size: "M",
        stock: 18,
        price: 44.99,
        image: "http://example.com/image53.jpg",
      },
      {
        color: "Khaki",
        colorHex: "#F0E68C",
        size: "L",
        stock: 15,
        price: 44.99,
        image: "http://example.com/image54.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Athletic Shorts",
    description: "Comfortable athletic shorts for workouts.",
    category: "Shorts",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Black",
        colorHex: "#000000",
        size: "S",
        stock: 22,
        price: 34.99,
        image: "http://example.com/image55.jpg",
      },
      {
        color: "Gray",
        colorHex: "#808080",
        size: "M",
        stock: 20,
        price: 34.99,
        image: "http://example.com/image56.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Bermuda Shorts",
    description: "Stylish Bermuda shorts for a relaxed look.",
    category: "Shorts",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Navy",
        colorHex: "#003366",
        size: "L",
        stock: 16,
        price: 49.99,
        image: "http://example.com/image57.jpg",
      },
      {
        color: "Beige",
        colorHex: "#F5F5DC",
        size: "M",
        stock: 14,
        price: 49.99,
        image: "http://example.com/image58.jpg",
      },
    ],
    attributes: [],
  },

  // Hoodies
  {
    name: "Graphic Hoodie",
    description: "A hoodie with a trendy graphic design.",
    category: "Hoodies",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Gray",
        colorHex: "#808080",
        size: "M",
        stock: 18,
        price: 59.99,
        image: "http://example.com/image59.jpg",
      },
      {
        color: "Black",
        colorHex: "#000000",
        size: "L",
        stock: 16,
        price: 59.99,
        image: "http://example.com/image60.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Zip-Up Hoodie",
    description: "A versatile zip-up hoodie for casual wear.",
    category: "Hoodies",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Navy",
        colorHex: "#003366",
        size: "M",
        stock: 20,
        price: 64.99,
        image: "http://example.com/image61.jpg",
      },
      {
        color: "Charcoal",
        colorHex: "#36454F",
        size: "L",
        stock: 18,
        price: 64.99,
        image: "http://example.com/image62.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Pullover Hoodie",
    description: "A comfortable pullover hoodie for everyday use.",
    category: "Hoodies",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Maroon",
        colorHex: "#800000",
        size: "L",
        stock: 14,
        price: 69.99,
        image: "http://example.com/image63.jpg",
      },
      {
        color: "Forest Green",
        colorHex: "#228B22",
        size: "M",
        stock: 16,
        price: 69.99,
        image: "http://example.com/image64.jpg",
      },
    ],
    attributes: [],
  },
  {
    name: "Oversized Hoodie",
    description: "An oversized hoodie for a relaxed fit.",
    category: "Hoodies",
    reviewCount: 0,
    rating: 0,
    variants: [
      {
        color: "Beige",
        colorHex: "#F5F5DC",
        size: "M",
        stock: 12,
        price: 74.99,
        image: "http://example.com/image65.jpg",
      },
      {
        color: "Black",
        colorHex: "#000000",
        size: "L",
        stock: 10,
        price: 74.99,
        image: "http://example.com/image66.jpg",
      },
    ],
    attributes: [],
  },
];

const addImages = async () => {
  try {
    const querys = [];
    products.forEach((product) => {
      product.variants.forEach((varient) => {
        querys.push(`${varient.color} ${product.name}`);
      });
    });
    const promises = querys.map(async (query) => {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=1&per_page=5&query=${query}&client_id=FmWVzU9t_ZbztGOiq5DU0tJYIzTFV_YJpo-OsGFygbo`
      );
      const resJson = await response.json();
      return { query, data: resJson };
    });
    const images = await Promise.all(promises);

    fs.writeFileSync("new.js", JSON.stringify(images));

    const { data } = require("./new");
    const images2 = data.map((response) => {
      const random = genRandom(0, response.results.length);
      return {
        query: response.query,
        name: response.results[random].slug,
        url: response.results[random].urls,
      };
    });

    fs.writeFileSync("images.js", JSON.stringify(images2));
  } catch (error) {
    console.log(error.message);
  }
};

const seed = async () => {
  try {
    await Category.deleteMany({});
    await Category.insertMany(categories);

    await Product.deleteMany({});
    products.forEach((product) => {
      product.variants.forEach((varient) => {
        varient.image =
          "https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      });
    });
    await Product.insertMany(products);
    const savedProducts = await Product.find();

    await User.deleteMany({});
    for (let i = 0; i < 30; i++) {
      const user = new User({
        name: `user-${i}`,
        email: `user-${i}@gmail.com`,
        password: await bcrypt.hash("1234", 10),
      });
      const x = await user.save();
    }
    const users = await User.find();

    savedProducts.forEach(async (product) => {
      let reviewsToAdd = [];
      for (let i = 1; i < genRandom(5, 20); i++) {
        const rev = {
          rating: reviews[genRandom(0, reviews.length)].rating,
          review: reviews[genRandom(0, reviews.length)].review,
          user: users[genRandom(0, users.length)]._id,
          product: product._id,
        };
        reviewsToAdd.push(rev);
      }
      product.reviews = [...reviewsToAdd];
      const x = await product.save();
    });

    console.log("Database Seeded");
  } catch (error) {
    console.log(error.message);
  }
};

seed();
// addImages();
