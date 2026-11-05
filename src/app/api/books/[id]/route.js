import { NextResponse } from 'next/server';
import { getDb, verifyApiToken } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = getDb();
    const book = db.books.find((b) => b._id === id);

    if (!book) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (err) {
    return NextResponse.json({ message: 'Error retrieving book', error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = verifyApiToken(req);
    const { id } = params;
    const body = await req.json();

    const db = getDb();
    const index = db.books.findIndex((b) => b._id === id);

    if (index === -1) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    const existing = db.books[index];
    const newTotal = body.totalCopies ? parseInt(body.totalCopies, 10) : existing.totalCopies;
    const diff = newTotal - (existing.totalCopies || 1);
    const newAvailable = Math.max(0, (existing.availableCopies || 0) + diff);

    db.books[index] = {
      ...existing,
      title: body.title || existing.title,
      author: body.author || existing.author,
      category: body.category || existing.category,
      image: body.image || existing.image,
      description: body.description || existing.description,
      totalCopies: newTotal,
      availableCopies: newAvailable,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, message: 'Book updated successfully!' });
  } catch (err) {
    return NextResponse.json({ message: 'Error updating book', error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const db = getDb();
    const index = db.books.findIndex((b) => b._id === id);

    if (index === -1) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    db.books.splice(index, 1);
    return NextResponse.json({ success: true, message: 'Book deleted successfully!' });
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting book', error: err.message }, { status: 500 });
  }
}
