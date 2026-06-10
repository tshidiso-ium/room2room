import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebaseClient';

export const DEFAULT_AGENT_NAME = 'Room Finders agent';
export const DEFAULT_WHATSAPP_NUMBER = '27796849423';

function cleanText(value) {
  return String(value || '').trim();
}

export function buildAgentSnapshot(user, profile = {}) {
  const name =
    cleanText(profile.name) ||
    cleanText(profile.displayName) ||
    cleanText(user?.displayName) ||
    cleanText(user?.email) ||
    DEFAULT_AGENT_NAME;

  return {
    id: user?.uid || cleanText(profile.id) || cleanText(profile.uid),
    uid: user?.uid || cleanText(profile.uid) || cleanText(profile.id),
    name,
    email: cleanText(profile.email) || cleanText(user?.email),
    phone: cleanText(profile.phone),
    agency: cleanText(profile.agency),
  };
}

export function getListingAgent(listing = {}) {
  const agent = listing.agent || {};

  return {
    id: cleanText(agent.id) || cleanText(agent.uid) || cleanText(listing.agentId),
    uid: cleanText(agent.uid) || cleanText(agent.id) || cleanText(listing.agentId),
    name: cleanText(agent.name) || cleanText(listing.agentName) || DEFAULT_AGENT_NAME,
    email: cleanText(agent.email) || cleanText(listing.agentEmail),
    phone: cleanText(agent.phone) || cleanText(listing.agentPhone),
    agency: cleanText(agent.agency) || cleanText(listing.agentAgency),
  };
}

export function getWhatsappNumber(phone, fallback = DEFAULT_WHATSAPP_NUMBER) {
  let digits = cleanText(phone).replace(/\D/g, '');

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  if (digits.startsWith('0')) {
    digits = `27${digits.slice(1)}`;
  }

  return digits || fallback;
}

export async function getAgentProfile(uid) {
  if (!uid) return null;

  const profileRef = doc(db, 'agents', uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    return null;
  }

  return {
    id: profileSnap.id,
    ...profileSnap.data(),
  };
}

export async function upsertAgentProfile(user, profileInput = {}) {
  if (!user?.uid) {
    throw new Error('A signed-in user is required to save an agent profile.');
  }
  
  const profileRef = doc(db, 'agents', user.uid);
  const profileSnap = await getDoc(profileRef);
  const existingProfile = profileSnap.exists() ? profileSnap.data() : {};
  const agent = buildAgentSnapshot(user, {
    ...existingProfile,
    ...profileInput,
  });

  const payload = {
    ...agent,
    updatedAt: serverTimestamp(),
  };

  if (!profileSnap.exists()) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(profileRef, payload, { merge: true });

  return agent;
}
