/* eslint-disable no-unused-vars */
"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Clock, Eye, Filter, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { deleteOrder, fetchOrder, fetchOrderById } from "@/_services";
import { TimeHeader } from "@/components";
import { useAppSelector } from "@/hooks";
import { useRouter } from "@/navigation";

const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  date.setHours(date.getHours() + 2);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const dateStr = `${day}/${month}/${year}`;
  const timeStr = `${hours}:${minutes}`;

  return `${dateStr} ${timeStr}`;
};

function Orders() {
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentWaiter = useAppSelector((state) => state.currentWaiter.currentWaiter);

  const [tableSort, setTableSort] = useState<"asc" | "desc">("asc");
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date().toISOString()).split(" ")[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Delete order mutation
  const deleteOrderMutation = useMutation(deleteOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
  });

  // Existing query
  const { isLoading, data: orders } = useQuery("order", fetchOrder, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    select: (data) => {
      if (!data) return {};

      // Filter by selected date
      const filteredByDate = data.filter((order: any) => formatDate(order.createdTime).split(" ")[0] === selectedDate);

      // Sort by table number
      const sorted = [...filteredByDate].sort((a, b) => {
        const tableA = parseInt(a.table);
        const tableB = parseInt(b.table);

        return tableSort === "asc" ? tableA - tableB : tableB - tableA;
      });

      // Group by hour
      const groupedByHour = sorted.reduce((acc: any, order) => {
        // Extract hour from the formatted date
        const dateTime = formatDate(order.createdTime);
        const hour = dateTime.split(" ")[1]; // Get the time part

        if (!acc[hour]) {
          acc[hour] = [];
        }
        acc[hour].push(order);
        return acc;
      }, {});

      return groupedByHour;
    },
  });

  const handleDelete = async (orderId: string) => {
    try {
      await deleteOrderMutation.mutateAsync({ orderId });
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleView = async (orderId: string) => {
    try {
      const details = await fetchOrderById({ orderId });

      setSelectedOrderDetails(details);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  if (!currentWaiter) router.push("/dashboard");

  if (isLoading)
    return (
      <div className="flex h-full overflow-scroll pb-12">
        <p className="m-auto">Loading order</p>
      </div>
    );

  return (
    <div className="h-full overflow-scroll pb-12 border-2 border-neutral-900">
      <TimeHeader waiterName={currentWaiter?.name} />

      {/* Filters Section */}
      <div className="shadow-lg p-4 mb-6">
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 hover:text-blue-500">
          <Filter size={20} />
          <span>Toggle Filters</span>
        </button>

        {showFilters && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Table Sort:</span>
              <button
                onClick={() => setTableSort(tableSort === "asc" ? "desc" : "asc")}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gr"
              >
                {tableSort === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                Table {tableSort.toUpperCase()}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Display */}
      <div className="px-6">
        {orders &&
          Object.entries(orders).map(([hour, hourOrders]: [string, any]) => (
            <div key={hour} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={24} className="text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800">{hour}</h2>
                <span className="text-sm text-gray-500">({hourOrders.length} orders)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hourOrders.map((order: any) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-blue-500 text-white p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Table {order.table}</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(order.id)}
                            className="p-1 hover:bg-blue-600 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1 hover:bg-blue-600 rounded-md transition-colors"
                            disabled={deleteOrderMutation.isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="text-sm">{formatDate(order.createdTime)}</span>
                        </div>
                      </div>
                      <p className="text-sm mt-1">Waiter: {order.waiter}</p>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      {order.orderMenuItems?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                        >
                          <span className="font-medium">{item.menuItem.names[locale]}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Status */}
                    <div className="px-4 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

        {orders && Object.keys(orders).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
