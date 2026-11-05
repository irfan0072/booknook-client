import { NextResponse } from 'next/server';
import { getDb, verifyApiToken } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const email = searchParams.get('email');

    const db = getDb();
    let results = [...db.books];

    if (email) {
      results = results.filter((b) => b.userEmail?.toLowerCase() === email.toLowerCase());
    }

    if (category && category !== 'All') {
      results = results.filter((b) => b.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (limit) {
      results = results.slice(0, parseInt(limit, 10));
    }

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching books', error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = verifyApiToken(req);
    const body = await req.json();

    const db = getDb();
    const totalCopies = parseInt(body.totalCopies, 10) || 1;

    const newBook = {
      _id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: body.title,
      author: body.author,
      category: body.category,
      image: body.image,
      description: body.description,
      userName: user?.name || body.userName || 'Library Member',
      userEmail: user?.email || body.userEmail || 'member@booknook.com',
      totalCopies: totalCopies,
      availableCopies: totalCopies,
      createdAt: new Date().toISOString()
    };

    db.books.unshift(newBook);

    return NextResponse.json(
      { success: true, message: 'Book added successfully!', insertedId: newBook._id },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: 'Error creating book', error: err.message }, { status: 500 });
  }
}
