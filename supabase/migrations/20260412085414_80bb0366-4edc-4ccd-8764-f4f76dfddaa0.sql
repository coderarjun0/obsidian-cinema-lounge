CREATE TABLE public.vault (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id INTEGER NOT NULL,
  movie_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id)
);

ALTER TABLE public.vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vault" ON public.vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own vault" ON public.vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their own vault" ON public.vault FOR DELETE USING (auth.uid() = user_id);