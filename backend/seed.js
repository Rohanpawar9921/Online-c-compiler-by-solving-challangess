// backend/seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Challenge = require('./models/Challenge');
const Badge = require('./models/Badge');

// Sample data
const seedData = async () => {
  // Clear existing data
  await User.deleteMany();
  await Challenge.deleteMany();
  await Badge.deleteMany();

  // Create test user
  const user = new User({
    email: 'test@example.com',
    password: 'password123'
  });
  await user.save();

  // Create challenges
  const challenges = [
    {
      title: "Hello World",
      description: "Write a C program that prints 'Hello, World!' to the console.",
      difficulty: "basic",
      testCases: [
        { input: "", output: "       Hello, World!" }
      ],
      starterCode: `#include <stdio.h>\n\nint main() {\n  // Your code here\n  return 0;\n}`
    },
    {
      title: "Sum of Two Numbers",
      description: "Create a program that reads two integers from input and prints their sum.",
      difficulty: "basic",
      testCases: [
        { input: "5 7", output: "12" },
        { input: "10 -3", output: "7", hidden: true },
        { input: "0 0", output: "0", hidden: true }
      ],
      starterCode: `#include <stdio.h>\n\nint main() {\n  int a, b;\n  // Read two integers and print their sum\n  return 0;\n}`
    },
    {
      title: "Even or Odd",
      description: "Write a program that determines if an input number is even or odd.",
      difficulty: "basic",
      testCases: [
        { input: "4", output: "Even" },
        { input: "7", output: "Odd" },
        { input: "0", output: "Even", hidden: true },
        { input: "-3", output: "Odd", hidden: true }
      ],
      starterCode: `#include <stdio.h>\n\nint main() {\n  int num;\n  scanf("%d", &num);\n  \n  // Your code here\n  \n  return 0;\n}`
    },
    {
      title: "Factorial Calculator",
      description: "Calculate the factorial of a given number n (n!). The factorial is the product of all positive integers less than or equal to n.",
      difficulty: "intermediate",
      testCases: [
        { input: "5", output: "120" },
        { input: "0", output: "1" },
        { input: "10", output: "3628800", hidden: true }
      ],
      starterCode: `#include <stdio.h>\n\nint main() {\n  int n;\n  scanf("%d", &n);\n  \n  // Calculate n!\n  \n  return 0;\n}`
    },
    {
      title: "Fibonacci Sequence",
      description: "Print the nth number in the Fibonacci sequence. The sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones.",
      difficulty: "intermediate",
      testCases: [
        { input: "7", output: "13" },
        { input: "1", output: "1" },
        { input: "12", output: "144", hidden: true }
      ],
      starterCode: `#include <stdio.h>\n\nint main() {\n  int n;\n  scanf("%d", &n);\n  \n  // Print the nth Fibonacci number\n  \n  return 0;\n}`
    },
    {
      title: "Prime Number Check",
      description: "Determine if a given number is prime or not. If it's prime, print 'Prime', otherwise print 'Not Prime'.",
      difficulty: "intermediate",
      testCases: [
        { input: "17", output: "Prime" },
        { input: "4", output: "Not Prime" },
        { input: "97", output: "Prime", hidden: true },
        { input: "91", output: "Not Prime", hidden: true }
      ],
      starterCode: `#include <stdio.h>\n\nint main() {\n  int number;\n  scanf("%d", &number);\n  \n  // Check if number is prime\n  \n  return 0;\n}`
    },
    {
      title: "Reverse an Array",
      description: "Read n integers into an array, then print them in reverse order.",
      difficulty: "intermediate",
      testCases: [
        { input: "5\n1 2 3 4 5", output: "5 4 3 2 1" },
        { input: "3\n7 8 9", output: "9 8 7" },
        { input: "4\n10 20 30 40", output: "40 30 20 10", hidden: true }
      ],
      starterCode: `#include <stdio.h>\n\nint main() {\n  int n;\n  scanf("%d", &n);\n  \n  // Read array and print in reverse\n  \n  return 0;\n}`
    },
    {
      title: "Palindrome Checker",
      description: "Check if a given string is a palindrome (reads the same forwards and backwards). Print 'Palindrome' or 'Not Palindrome'.",
      difficulty: "advanced",
      testCases: [
        { input: "racecar", output: "Palindrome" },
        { input: "hello", output: "Not Palindrome" },
        { input: "madam", output: "Palindrome", hidden: true },
        { input: "A man a plan a canal Panama", output: "Not Palindrome", hidden: true } // Contains spaces
      ],
      starterCode: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n  char str[100];\n  scanf("%s", str);\n  \n  // Check if str is a palindrome\n  \n  return 0;\n}`
    },
    {
      title: "Binary Search",
      description: "Implement binary search to find a target element in a sorted array. Print the index if found, or -1 if not found.",
      difficulty: "advanced",
      testCases: [
        { input: "5\n1 3 5 7 9\n5", output: "2" }, // 5 is at index 2
        { input: "6\n2 4 6 8 10 12\n7", output: "-1" }, // 7 is not in the array
        { input: "8\n1 2 3 4 5 6 7 8\n8", output: "7", hidden: true } // 8 is at index 7
      ],
      starterCode: `#include <stdio.h>\n\nint main() {\n  int n;\n  scanf("%d", &n);\n  \n  int arr[n];\n  for(int i = 0; i < n; i++) {\n    scanf("%d", &arr[i]);\n  }\n  \n  int target;\n  scanf("%d", &target);\n  \n  // Implement binary search to find target in arr\n  \n  return 0;\n}`
    },
    {
      title: "Bubble Sort",
      description: "Implement the bubble sort algorithm to sort an array of integers in ascending order.",
      difficulty: "advanced",
      testCases: [
        { input: "5\n5 1 4 2 8", output: "1 2 4 5 8" },
        { input: "3\n3 2 1", output: "1 2 3" },
        { input: "7\n7 6 5 4 3 2 1", output: "1 2 3 4 5 6 7", hidden: true }
      ],
      starterCode: `#include <stdio.h>\n\nint main() {\n  int n;\n  scanf("%d", &n);\n  \n  int arr[n];\n  for(int i = 0; i < n; i++) {\n    scanf("%d", &arr[i]);\n  }\n  \n  // Implement bubble sort to sort arr\n  \n  // Print the sorted array\n  \n  return 0;\n}`
    }
  ];

  await Challenge.insertMany(challenges);

  // Create badges
  const badges = [
    {
      name: "C Novice",
      description: "Complete your first coding challenge",
      condition: "challengesCompleted",
      threshold: 1,
      icon: "🥉"
    },
    {
      name: "Rising Programmer",
      description: "Complete 3 basic challenges",
      condition: "challengesCompleted",
      threshold: 3,
      icon: "🥈"
    },
    {
      name: "Code Warrior",
      description: "Complete 5 challenges of any difficulty",
      condition: "challengesCompleted",
      threshold: 5,
      icon: "🥇"
    },
    {
      name: "Intermediate Coder",
      description: "Complete 3 intermediate challenges",
      condition: "challengesCompleted",
      threshold: 3,
      icon: "🏆"
    },
    {
      name: "Algorithm Master",
      description: "Complete 2 advanced challenges",
      condition: "challengesCompleted",
      threshold: 2,
      icon: "👑"
    },
    {
      name: "Dedicated Learner",
      description: "Maintain a 5-day coding streak",
      condition: "streak",
      threshold: 5,
      icon: "🔥"
    }
  ];

  await Badge.insertMany(badges);
  
  console.log('Database seeded successfully!');
};

// Connect and seed
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/compiler-app')
  .then(() => seedData())
  .catch(err => console.error('Seeding failed:', err))
  .finally(() => mongoose.disconnect());