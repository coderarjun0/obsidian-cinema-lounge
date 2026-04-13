import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Review {
  id: string;
  user_id: string;
  user_email?: string;
  media_id: number;
  media_type: "movie" | "series";
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export function useReviews(mediaId: number, mediaType: "movie" | "series") {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("media_id", mediaId)
      .eq("media_type", mediaType)
      .order("created_at", { ascending: false });

    if (data) {
      const mapped = data.map((r: any) => ({
        ...r,
        media_type: r.media_type as "movie" | "series",
      })) as Review[];
      setReviews(mapped);
      if (user) {
        setUserReview(mapped.find((r) => r.user_id === user.id) ?? null);
      }
    }
    setLoading(false);
  }, [mediaId, mediaType, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = useCallback(
    async (rating: number, reviewText: string) => {
      if (!user) return;
      const trimmed = reviewText.trim();
      if (trimmed.length > 2000) return;

      if (userReview) {
        await supabase
          .from("reviews")
          .update({ rating, review_text: trimmed || null, updated_at: new Date().toISOString() })
          .eq("id", userReview.id);
      } else {
        await supabase.from("reviews").insert({
          user_id: user.id,
          media_id: mediaId,
          media_type: mediaType,
          rating,
          review_text: trimmed || null,
        });
      }
      await fetchReviews();
    },
    [user, userReview, mediaId, mediaType, fetchReviews]
  );

  const deleteReview = useCallback(async () => {
    if (!user || !userReview) return;
    await supabase.from("reviews").delete().eq("id", userReview.id);
    await fetchReviews();
  }, [user, userReview, fetchReviews]);

  const avgRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : null;

  return { reviews, userReview, loading, submitReview, deleteReview, avgRating };
}
