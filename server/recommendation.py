from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Sample game data (replace with real game data)
games_df = pd.DataFrame({
    'id': [1, 2, 3, 4],
    'title': ['Game A', 'Game B', 'Game C', 'Game D'],
    'genres': ['Action RPG', 'Puzzle Adventure', 'RPG Strategy', 'Action Puzzle'],
})

# Content-based filtering function
def recommend_games(game_title, num_recommendations=3):
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(games_df['genres'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    idx = games_df[games_df['title'] == game_title].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:num_recommendations + 1]
    game_indices = [i[0] for i in sim_scores]
    return games_df['title'].iloc[game_indices].tolist()

# API route for recommendations
@app.route('/recommend', methods=['GET'])
def recommend():
    game_title = request.args.get('title')
    recommendations = recommend_games(game_title)
    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True)
