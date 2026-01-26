// app/api/track-visit/route.js
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebaseClient";
import { FieldValue } from "firebase-admin/firestore";

export async function POST() {
  try {
    // Collection: "stats", Document: "site"
    const docRef = db.collection("stats").doc("site");

    await docRef.set(
      {
        visitCount: FieldValue.increment(1),
        lastVisitedAt: new Date(),
      },
      { merge: true }
    );

    const snapshot = await docRef.get();
    const data = snapshot.data() || {};

    return NextResponse.json(
      { success: true, visitCount: data.visitCount || 0 },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating visit count:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update counter" },
      { status: 500 }
    );
  }
}
