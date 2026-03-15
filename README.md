# CashBook

## Description

CashBook is a comprehensive web application designed to help users manage their financial transactions and inventory efficiently. Whether you're running a small business or keeping track of personal expenses, CashBook provides an intuitive interface to add transactions, view transaction history, manage inventory, and monitor sales statistics.

The application focuses on simplicity and ease of use, allowing users to quickly log sales, track daily and total revenue, and maintain an inventory of items. It's built with modern web technologies to ensure a responsive and secure experience.


![Alt Text](https://github.com/Qasimabbasi786/Book-Shop-Management-System/blob/main/ss1.JPG)
![Alt Text](https://github.com/Qasimabbasi786/Book-Shop-Management-System/blob/main/ss2.JPG)
![Alt Text](https://github.com/Qasimabbasi786/Book-Shop-Management-System/blob/main/ss3.JPG)
![Alt Text](https://github.com/Qasimabbasi786/Book-Shop-Management-System/blob/main/ss4.JPG)

## Features

- **User Authentication**: Secure login and signup functionality to protect user data.
- **Transaction Management**: Add new transactions, view detailed transaction history, and calculate sales metrics.
- **Inventory Tracking**: Manage and monitor inventory items.
- **Dashboard**: Overview of total sales, daily sales, transaction counts, and recent activities.
- **Responsive Design**: Optimized for desktop and mobile devices using Tailwind CSS.

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router
- **Backend**: Supabase (for database and authentication)
- **Icons**: Lucide React
- **Other**: Axios for HTTP requests

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd cashbook
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## Usage

- **Signup/Login**: Create an account or log in to access the application.
- **Home Dashboard**: View sales statistics and recent transactions.
- **Add Transaction**: Log new sales transactions.
- **Transaction History**: Review all past transactions.
- **Inventory**: Manage your inventory items.
- **About**: Learn more about the application.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
