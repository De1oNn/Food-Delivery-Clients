// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Bell, ShoppingCart, MapPin, Settings, CircleX } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// export default function Sidebar({
//   user,
//   notifications,
//   setIsNotifOpen,
//   setIsCartOpen,
//   setIsRestaurantModalOpen,
//   fetchNotifications,
//   fetchOrders,
//   navigateToProfile,
//   navigateToSettings,
// }) {
//   return (
//     <Accordion type="single" collapsible className="w-full">
//       <AccordionItem value="item-1" className="border-none">
//         <AccordionTrigger className="p-5 h-[112px] w-[112px] hover:no-underline focus:outline-none flex justify-center">
//           <div className="flex items-center justify-center p-2 transition-transform duration-200 hover:scale-105">
//             <Avatar className="h-14 w-14 ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900 transition-all duration-300 hover:ring-orange-400">
//               <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="object-cover" />
//               <AvatarFallback className="bg-gray-700 text-white text-lg font-semibold">
//                 {user?.name?.[0] || "U"}
//               </AvatarFallback>
//             </Avatar>
//           </div>
//         </AccordionTrigger>
//         <AccordionContent className="mt-2">
//           <aside className="fixed top-0 left-0 h-full w-24 bg-gradient-to-b from-orange-600 to-orange-700 shadow-xl flex flex-col items-center py-8 space-y-10 z-50 transition-all duration-300">
//             <AccordionTrigger className="p-2 rounded-full hover:bg-orange-800/50 transition-colors duration-200">
//               <CircleX className="h-6 w-6 text-white hover:text-orange-200" />
//             </AccordionTrigger>
//             <div className="flex items-center gap-3 cursor-pointer group" onClick={navigateToProfile}>
//               <Avatar className="h-12 w-12 ring-2 ring-orange-400 ring-offset-2 ring-offset-orange-800 transition-transform duration-300 group-hover:scale-110 group-hover:ring-orange-300">
//                 <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="object-cover" />
//                 <AvatarFallback className="bg-gray-700 text-white text-lg font-semibold">
//                   {user?.name?.[0] || "U"}
//                 </AvatarFallback>
//               </Avatar>
//             </div>
//             <div className="relative group">
//               <Bell
//                 className="h-7 w-7 text-white hover:text-orange-200 cursor-pointer transition-colors duration-200 group-hover:scale-110"
//                 onClick={() => {
//                   setIsNotifOpen(true);
//                   fetchNotifications();
//                 }}
//               />
//               {notifications.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
//                   {notifications.length}
//                 </span>
//               )}
//             </div>
//             <ShoppingCart
//               className="h-7 w-7 text-white hover:text-orange-200 cursor-pointer transition-colors duration-200 hover:scale-110"
//               onClick={() => {
//                 setIsCartOpen(true);
//                 if (user) fetchOrders(user.name);
//               }}
//             />
//             <MapPin
//               className="h-7 w-7 text-white hover:text-orange-200 cursor-pointer transition-colors duration-200 hover:scale-110"
//               onClick={() => setIsRestaurantModalOpen(true)}
//             />
//             <Settings
//               className="h-7 w-7 text-white hover:text-orange-200 cursor-pointer transition-colors duration-200 hover:scale-110"
//               onClick={navigateToSettings}
//             />
//           </aside>
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   );
// }