# BookNook – A Small Online Library (Client)

**BookNook** is a modern, responsive, and community-driven digital library platform built with **Next.js (App Router)**, **Tailwind CSS**, and **MongoDB with Express.js**. Users can explore our catalog, borrow available books for 14 days, return books, and contribute new titles to the community bookshelf.

### 🌐 Live Deployment
- **Live Website URL**: [https://booknook-client-azure.vercel.app](https://booknook-client-azure.vercel.app)
- **Server API URL**: [https://booknook-server-api.onrender.com](https://booknook-server-api.onrender.com)
- **Client Repository**: [https://github.com/irfan0072/booknook-client](https://github.com/irfan0072/booknook-client)
- **Server Repository**: [https://github.com/irfan0072/booknook-server](https://github.com/irfan0072/booknook-server)

---

## ✨ 5 Key Features of BookNook
1. **Interactive Swiper Hero & New Arrivals**: Dynamic home page featuring an interactive Swiper.js multi-slide banner, followed by the latest 6 dynamic new arrivals loaded directly from MongoDB with sort and limit.
2. **Atomic Inventory & Real-Time Availability**: Powered by MongoDB `$inc`, borrowing decreases available copies by 1, and returning increases available copies by 1. Out-of-stock books automatically disable the borrow button with a "Not Available" badge.
3. **No Double-Borrow Protection**: Prevents members from borrowing the same title twice concurrently. If an active loan exists for the user, an error toast alerts the borrower.
4. **Seamless Authentication & Private Route Persistence**: Secure authentication with JWT token verification. On page reload across any private route (`/add-book`, `/my-books`, `/my-borrows`), the authenticated session persists smoothly without flashing or unexpected redirection.
5. **Full CRUD & Custom Confirmation Modals**: Add new books with read-only contributor metadata, edit book details with prefilled fields, and delete books through a custom non-blocking confirmation modal (zero browser default alerts).
6. **Dark & Light Mode Support**: Instant theme toggle with `next-themes` and persistent local preferences.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Lucide Icons
- **Slider**: Swiper.js
- **State & Auth**: React Context, JWT, LocalStorage persistence
- **Notifications**: React Hot Toast (No default alert dialogs)
- **Theming**: Next-Themes (Dark/Light mode)

---

## 🔐 Demo Test Credentials for Examiner
- **Email**: `admin@booknook.com`
- **Password**: `Admin123`
- *(Or use the "Continue with Google" social login button for instant 1-click access)*

---

## ⚙️ Environment Configuration
Create a `.env.local` file in the root of the `client` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📦 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/irfan0072/booknook-client.git

# Navigate to client directory
cd booknook-client # or client

# Install dependencies
npm install # or bun install

# Run development server
npm run dev # or bun dev

# Open http://localhost:3000 in your browser
```
