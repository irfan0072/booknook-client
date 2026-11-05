import { NextResponse } from 'next/server';
import { getDb, verifyApiToken } from '@/lib/db';

export async function GET(req) {
  try {
    const user = verifyApiToken(req);
    const db = getDb();

    let userBorrows = [...db.borrows];
    if (user?.email) {
      userBorrows = userBorrows.filter(
        (b) => b.userEmail?.toLowerCase() === user.email.toLowerCase() && b.status === 'borrowed'
      );
    }

    return NextResponse.json(userBorrows);
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching borrows', error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = verifyApiToken(req);
    const body = await req.json();
    const { bookId, bookTitle, bookImage, returnDate, userName, userEmail } = body;

    const email = user?.email || userEmail;
    if (!email) {
      return NextResponse.json({ message: 'User must be authenticated to borrow a book' }, { status: 401 });
    }

    const db = getDb();
    const bookIndex = db.books.findIndex((b) => b._id === bookId);

    if (bookIndex === -1) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    const book = db.books[bookIndex];

    if ((book.availableCopies ?? 1) <= 0) {
      return NextResponse.json({ message: 'Sorry, this book is currently out of stock!' }, { status: 400 });
    }

    // Challenge: No Double Borrow check
    const existingBorrow = db.borrows.find(
      (b) => b.bookId === bookId && b.userEmail?.toLowerCase() === email.toLowerCase() && b.status === 'borrowed'
    );

    if (existingBorrow) {
      return NextResponse.json(
        { message: 'You have already borrowed this book and have not returned it yet!' },
        { status: 400 }
      );
    }

    // Challenge: Atomic decrease available copies by 1 ($inc: -1)
    db.books[bookIndex].availableCopies = Math.max(0, (db.books[bookIndex].availableCopies || 1) - 1);

    const borrowRecord = {
      _id: `borrow_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      bookId: bookId,
      bookTitle: bookTitle || book.title,
      bookImage: bookImage || book.image,
      userEmail: email,
      userName: userName || user?.name || 'Library Member',
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: returnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'borrowed',
      createdAt: new Date().toISOString()
    };

    db.borrows.unshift(borrowRecord);

    return NextResponse.json(
      { success: true, message: 'Book borrowed successfully!', insertedId: borrowRecord._id },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: 'Error processing borrow', error: err.message }, { status: 500 });
  }
}
