"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

interface MainNavProps {
  data: Category[];
}

const MainNav = ({ data }: MainNavProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
        {routes.map((route, index) => (
          <motion.div
            key={route.href}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="relative"
          >
            <Link
              href={route.href}
              className={cn(
                "relative block px-3 py-2 text-sm font-medium transition-colors",
                route.active ? "text-white" : "text-neutral-400 hover:text-white"
              )}
            >
              {route.label}

              {/* Hover background */}
              {hoveredIndex === index && !route.active && (
                <motion.span
                  className="absolute inset-0 -z-10 rounded-md bg-[#222]"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}

              {/* Active indicator */}
              {route.active && (
                <motion.div
                  className="absolute inset-0 -z-10 rounded-md bg-[#333]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Underline effect */}
              {route.active && (
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                />
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Mobile Menu Button (Top Right) */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              className="text-black p-2 rounded-md "
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[80%] sm:w-[350px] bg-white text-black border-r-0 p-0"
          >
            <div className="flex flex-col space-y-1 py-4">
              <motion.h2
                className="mb-4 px-4 text-lg font-semibold text-black"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                Categories
              </motion.h2>

              {routes.map((route, index) => (
                <motion.div
                  key={route.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3 text-sm font-medium transition-all",
                      route.active
                        ? "bg-[#4e4e4e1c] text-black"
                        : "text-black "
                    )}
                  >
                    <span>{route.label}</span>

                    <motion.div
                      animate={{
                        x: route.active ? 0 : -5,
                        opacity: route.active ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="text-black"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MainNav;
