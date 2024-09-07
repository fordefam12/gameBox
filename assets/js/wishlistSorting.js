function sortWishlist(criteria) {
    const sortedWishlist = wishlistArray.sort((a, b) => {
      if (criteria === 'rating') {
        return b.rating - a.rating;
      } else if (criteria === 'date') {
        return new Date(b.released) - new Date(a.released);
      }
    });
    renderWishlist(sortedWishlist);
  }
  