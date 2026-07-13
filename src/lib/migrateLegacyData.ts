import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * One-time migration: copies the OLD flat top-level `meals` and `orders`
 * collections (from before the multi-tenant rewrite) into a specific
 * brand's subcollections. Run this once, manually, from the browser
 * console while signed in as the superadmin, after you've created the
 * "African Palate / Cavendish" brand through the normal approval flow:
 *
 *   import { migrateLegacyDataToBrand } from './lib/migrateLegacyData';
 *   await migrateLegacyDataToBrand('YOUR_NEW_BRAND_ID');
 *
 * It does not delete the old collections — verify the new brand's data
 * looks right first, then delete `meals` and `orders` manually from the
 * Firebase console.
 */
export async function migrateLegacyDataToBrand(brandId: string) {
  const results = { meals: 0, orders: 0 };

  const legacyMeals = await getDocs(collection(db, 'meals'));
  for (const mealDoc of legacyMeals.docs) {
    await setDoc(doc(db, 'organizations', brandId, 'meals', mealDoc.id), mealDoc.data());
    results.meals += 1;
  }

  const legacyOrders = await getDocs(collection(db, 'orders'));
  for (const orderDoc of legacyOrders.docs) {
    await setDoc(doc(db, 'organizations', brandId, 'orders', orderDoc.id), orderDoc.data());
    results.orders += 1;
  }

  console.log(`Migration complete: ${results.meals} meals, ${results.orders} orders copied to brand ${brandId}.`);
  return results;
}
