"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.replace(/^\/+/g, '').split('/');
  if (segments[0] !== 'admin' || segments[1] !== 'dashboard') return null;
  const items = [
    { label: 'Admin Panel', href: '/admin/dashboard' },
    ...segments.slice(2).map((seg, idx) => {
      const label = seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const href = '/admin/dashboard/' + segments.slice(2, 2 + idx + 1).join('/');
      return { label, href };
    })
  ];
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
        </BreadcrumbItem>
        {items.length > 1 && <BreadcrumbSeparator className="hidden md:block" />}
        {items.slice(1).map((item, idx) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {idx === items.length - 2 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx < items.length - 2 && <BreadcrumbSeparator className="hidden md:block" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 