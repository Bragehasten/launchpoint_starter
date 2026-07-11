/**
 * Database types for the Supabase client.
 *
 * Hand-maintained to match supabase/migrations. When the schema grows,
 * regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 */

import type { Json } from "@/types/json";

export type UserRole = "admin" | "editor" | "user";
export type ContentStatus = "draft" | "published" | "archived";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type BookingStatus = "pending" | "confirmed" | "cancelled";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  created_at: string;
};

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: Json;
  cover_image: string | null;
  author_id: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type PostCategoryRow = {
  post_id: string;
  category_id: string;
};

type CmsPageRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  blocks: Json;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type MediaRow = {
  id: string;
  path: string;
  alt: string | null;
  created_by: string | null;
  created_at: string;
};

type FormSubmissionRow = {
  id: string;
  kind: string;
  email: string;
  data: Json;
  read: boolean;
  created_at: string;
};

type NewsletterSubscriberRow = {
  id: string;
  email: string;
  created_at: string;
  unsubscribed_at: string | null;
};

type PaymentRow = {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  customer_email: string | null;
  description: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  location_id: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ServiceGroupRow = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

type ServiceRow = {
  id: string;
  group_id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_note: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type LocationRow = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  hours: Json;
  map_url: string | null;
  slug: string;
  intro: string | null;
  map_embed_url: string | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  is_primary: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type LocationReviewRow = {
  id: string;
  location_id: string;
  author: string;
  rating: number;
  body: string;
  source: string;
  published: boolean;
  sort_order: number;
  created_at: string;
};

type ServiceAreaRow = {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  intro: string;
  body: string | null;
  faqs: Json;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type PromotionRow = {
  id: string;
  title: string;
  body: string;
  badge: string | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type GalleryAlbumRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

type GalleryItemRow = {
  id: string;
  album_id: string;
  media_path: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
};

type BookingRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  starts_at: string;
  duration_minutes: number;
  status: BookingStatus;
  deposit_session_id: string | null;
  location_id: string | null;
  created_at: string;
  updated_at: string;
};

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableShape<Row, RequiredInsert extends keyof Row, Rels extends Relationship[] = []> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, RequiredInsert>;
  Update: Partial<Row>;
  Relationships: Rels;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableShape<ProfileRow, "id" | "email">;
      categories: TableShape<CategoryRow, "slug" | "name">;
      posts: TableShape<PostRow, "slug" | "title">;
      post_categories: TableShape<
        PostCategoryRow,
        "post_id" | "category_id",
        [
          {
            foreignKeyName: "post_categories_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ]
      >;
      cms_pages: TableShape<CmsPageRow, "slug" | "title">;
      media: TableShape<MediaRow, "path">;
      form_submissions: TableShape<FormSubmissionRow, "kind" | "email">;
      newsletter_subscribers: TableShape<NewsletterSubscriberRow, "email">;
      payments: TableShape<PaymentRow, "stripe_session_id" | "amount">;
      team_members: TableShape<TeamMemberRow, "name" | "role">;
      service_groups: TableShape<ServiceGroupRow, "name">;
      services: TableShape<ServiceRow, "group_id" | "name">;
      locations: TableShape<LocationRow, "name" | "address" | "slug">;
      location_reviews: TableShape<LocationReviewRow, "location_id" | "author" | "rating" | "body">;
      service_areas: TableShape<ServiceAreaRow, "name" | "slug" | "intro">;
      promotions: TableShape<PromotionRow, "title" | "body">;
      gallery_albums: TableShape<GalleryAlbumRow, "slug" | "title">;
      gallery_items: TableShape<GalleryItemRow, "album_id" | "media_path">;
      bookings: TableShape<BookingRow, "name" | "email" | "starts_at">;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_editor: { Args: Record<string, never>; Returns: boolean };
      get_booked_ranges: {
        Args: { from_ts: string; to_ts: string };
        Returns: { starts_at: string; duration_minutes: number }[];
      };
    };
    Enums: {
      user_role: UserRole;
      content_status: ContentStatus;
      payment_status: PaymentStatus;
      booking_status: BookingStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = ProfileRow;
export type Category = CategoryRow;
export type Post = PostRow;
export type CmsPage = CmsPageRow;
export type MediaItem = MediaRow;
export type FormSubmission = FormSubmissionRow;
export type LocationReview = LocationReviewRow;
export type ServiceArea = ServiceAreaRow;
export type NewsletterSubscriber = NewsletterSubscriberRow;
