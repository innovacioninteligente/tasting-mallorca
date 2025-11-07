# Role-Based Routing Plan

This document outlines the intended access control for different sections of the application based on user roles. The roles are defined in Firebase Auth as custom claims.

## Roles

1.  **`customer`**: The default role for any new user who signs up. They are the end-users booking tours.
2.  **`guide`**: A tour guide who leads the excursions.
3.  **`admin`**: A super-user with full access to manage the platform's content and users.

---

## Route Access Control

### Public Routes (`/`)

-   **Authentication**: Not required.
-   **Description**: All marketing pages, tour listings, about us, contact, etc.
-   **Routes**:
    -   `/` (Home)
    -   `/about`
    -   `/contact`
    -   `/tours`
    -   `/tours/[slug]`
    -   `/signin`
    -   `/signup`
    -   `/road-map`

---

### Customer Dashboard (`/dashboard`)

-   **Role Required**: `customer`, `guide`, `admin` (All authenticated users)
-   **Description**: Personal area for users to manage their information and activities.
-   **Routes**:
    -   `/dashboard/overview`: General welcome page.
    -   `/dashboard/bookings`: View past and upcoming bookings.
    -   `/dashboard/profile`: Edit personal information (name, etc.).
    -   `/dashboard/settings`: Manage account settings (password, etc.).

---

### Guide Dashboard (`/dashboard/guide`)

-   **Role Required**: `guide`
-   **Description**: Tools for guides to manage their tours and schedules.
-   **Future Routes**:
    -   `/dashboard/guide/schedule`: View assigned tours and daily schedules.
    -   `/dashboard/guide/route-optimizer`: Access the AI tool to optimize pickup routes.
    -   `/dashboard/guide/manifests`: View passenger lists for upcoming tours.

---

### Admin Dashboard (`/dashboard/admin`)

-   **Role Required**: `admin`
-   **Description**: Full control panel for managing the entire platform.
-   **Current & Future Routes**:
    -   `/dashboard/users`: **(Implemented)** Manage users and assign roles.
    -   `/dashboard/admin/tours`: Create, edit, and delete tour information.
    -   `/dashboard/admin/bookings`: View and manage all bookings on the platform.
    -   `/dashboard/admin/content`: Manage multilingual content for static pages.
    -   `/dashboard/admin/analytics`: View platform analytics and reports.

---

This plan will serve as the blueprint for implementing secure, role-based navigation throughout the application.
