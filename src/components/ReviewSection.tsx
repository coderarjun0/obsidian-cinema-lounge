import { useState, useEffect } from "react";
import { Star, Send, Trash2, MessageSquare } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";

interface ReviewSectionProps {
  mediaId: number;
  mediaType: "movie" | "series";
  accentColor?: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = 16,
  accentColor,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
  accentColor?: string;
}) {
  const [hover, setHover] = useState(0);
  const fillColor = accentColor ?? "hsl(var(--primary))";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`transition-transform ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <Star
            style={{
              width: size,
              height: size,
              fill: star <= (hover || value) ? fillColor : "transparent",
              color: star <= (hover || value) ? fillColor : "hsl(var(--muted-foreground))",
            }}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ mediaId, mediaType, accentColor }: ReviewSectionProps) {
  const { user } = useAuth();
  const { reviews, userReview, loading, submitReview, deleteReview, avgRating } = useReviews(mediaId, mediaType);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setText(userReview.review_text ?? "");
    }
  }, [userReview]);

  const handleSubmit = async () => {
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    await submitReview(rating, text);
    setSubmitting(false);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    await deleteReview();
    setRating(0);
    setText("");
    setSubmitting(false);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h3>
        {avgRating !== null && (
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" style={accentColor ? { fill: accentColor, color: accentColor } : {}} />
            <span className="font-heading text-sm font-bold" style={accentColor ? { color: accentColor } : { color: "hsl(var(--primary))" }}>
              {avgRating}
            </span>
            <span className="font-body text-xs text-muted-foreground">/10</span>
          </div>
        )}
      </div>

      {/* Write / Edit Review */}
      {user ? (
        <div className="glass-panel rounded-xl p-4 mb-4">
          <p className="font-body text-xs text-muted-foreground mb-2">
            {userReview ? "Update your review" : "Rate & review"}
          </p>
          <StarRating value={rating} onChange={setRating} accentColor={accentColor} />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 2000))}
            placeholder="Write your thoughts (optional)..."
            rows={2}
            className="mt-3 w-full resize-none rounded-lg bg-secondary/50 border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="font-body text-[10px] text-muted-foreground">{text.length}/2000</span>
            <div className="flex gap-2">
              {userReview && (
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || submitting}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: accentColor ?? "hsl(var(--primary))" }}
              >
                <Send className="h-3 w-3" /> {userReview ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-xl p-4 mb-4 text-center">
          <p className="font-body text-sm text-muted-foreground">Sign in to leave a review</p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="font-body text-xs text-muted-foreground text-center py-4">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="font-body text-xs text-muted-foreground text-center py-4">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {reviews.map((r) => (
            <div key={r.id} className="glass-panel rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <StarRating value={r.rating} readonly size={12} accentColor={accentColor} />
                  <span className="font-heading text-xs font-bold" style={accentColor ? { color: accentColor } : { color: "hsl(var(--primary))" }}>
                    {r.rating}/10
                  </span>
                </div>
                <span className="font-body text-[10px] text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.review_text && (
                <p className="font-body text-xs text-secondary-foreground/80 mt-1 leading-relaxed">{r.review_text}</p>
              )}
              {r.user_id === user?.id && (
                <span className="font-body text-[10px] text-primary mt-1 inline-block" style={accentColor ? { color: accentColor } : {}}>You</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
