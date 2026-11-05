import { NextResponse } from 'next/server';
import { getDb, verifyApiToken } from '@/lib/db';

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const db = getDb();

    const borrowIndex = db.borrows.findIndex((b) => b._id === id);
    if (borrowIndex === -1) {
      return NextResponse.json({ message: 'Borrow record not found' }, { status: 404 });
    }

    const borrow = db.borrows[borrowIndex];

    // Challenge: Atomic increment available copies by 1 ($inc: 1)
    const bookIndex = db.books.findIndex((b) => b._id === borrow.bookId);
    if (bookIndex !== -1) {
      db.books[bookIndex].availableCopies = (db.books[bookIndex].availableCopies || 0) + 1;
    }

    db.borrows.splice(borrowIndex, 1);

    return NextResponse.json({ success: true, message: 'Book returned successfully!' });
  } catch (err) {
    return NextResponse.json({ message: 'Error returning book', error: err.message }, { status: 500 });
  }
}
