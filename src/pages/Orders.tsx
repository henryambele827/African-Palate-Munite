import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth, OperationType, handleFirestoreError } from '../components/AuthProvider';
import { useBrand } from '../components/BrandProvider';
import { Order } from '../types';
import { formatUGX, cn } from '../lib/utils';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, XCircle, Truck, ShoppingBag, MapPin, ChefHat, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { user } = useAuth();
  const { brandId } = useBrand();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !brandId) return;

    const path = `organizations/${brandId}/orders`;
    const ordersCol = collection(db, 'organizations', brandId, 'orders');
    const q = query(
      ordersCol, 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, brandId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-brand-orange">
        <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-brand-orange mb-4">
          <Truck size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Your Pre-Orders
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase italic leading-[0.9]">
          My Tracks.
        </h1>
        <p className="text-gray-500 font-medium mt-3 max-w-xl">
          Historical and upcoming meal deliveries — including deposit status,
          delivery date, and drop-off spot.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="bento-card py-24 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-orange/10 to-brand-yellow/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-brand-orange/20">
            <ShoppingBag className="text-brand-orange" size={40} />
          </div>
          <h2 className="text-2xl font-black text-black uppercase italic tracking-tighter mb-3">
            No tracks yet
          </h2>
          <p className="text-gray-400 font-medium mb-8 max-w-sm mx-auto">
            Once you place a pre-order, it will show up here so you can track
            its progress from pending to delivered.
          </p>
          <Link
            to="../menu"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-black uppercase tracking-widest italic text-xs hover:bg-brand-orange transition-colors"
          >
            Browse the Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={order.id}
                className="bento-card flex flex-col group hover:border-brand-orange/30 transition-all hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                      Order Ref
                    </div>
                    <div className="font-mono text-[10px] font-black text-black bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 uppercase inline-flex items-center gap-1">
                      #{order.id.slice(-6).toUpperCase()}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
                      statusInfo.className
                    )}
                  >
                    <StatusIcon size={12} />
                    {order.status}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-black uppercase tracking-tighter leading-tight mb-3 group-hover:text-brand-orange transition-colors">
                    {order.mealName}
                  </h3>
                  {order.selectedOption && (
                    <div className="text-[10px] font-black uppercase text-gray-400 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                      With {order.selectedOption}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs font-black text-brand-orange uppercase">
                    <span className="bg-brand-orange/10 px-2 py-1 rounded-lg">
                      Qty {order.quantity}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>{formatUGX(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-50 flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 flex-shrink-0 border border-gray-100">
                      <CalendarDays size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                        Est. Delivery
                      </div>
                      <div className="text-sm font-black text-black leading-none">
                        {format(new Date(order.deliveryDate), 'PPP')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 flex-shrink-0 border border-gray-100">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                        Spot
                      </div>
                      <div className="text-sm font-black text-black line-clamp-2 leading-tight">
                        {order.deliveryLocation}
                      </div>
                    </div>
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div className="mt-8 p-6 bg-brand-orange/5 rounded-[1.5rem] border border-brand-orange/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-[0.07] scale-150">
                      <ChefHat size={48} className="text-brand-orange" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange mb-2 block">
                      Deposit Required
                    </p>
                    <p className="text-base font-black text-brand-orange tracking-tighter leading-tight">
                      Pay {formatUGX(order.totalPrice * 0.5)} deposit to
                      confirm your slot.
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getStatusInfo(status: string) {
  switch (status) {
    case 'pending':
      return {
        icon: Clock,
        className: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'confirmed':
      return {
        icon: CheckCircle2,
        className: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'delivered':
      return {
        icon: CheckCircle2,
        className: 'bg-green-50 text-brand-green border-green-200',
      };
    case 'cancelled':
      return {
        icon: XCircle,
        className: 'bg-red-50 text-red-600 border-red-200',
      };
    default:
      return {
        icon: Clock,
        className: 'bg-gray-50 text-gray-600 border-gray-200',
      };
  }
}
