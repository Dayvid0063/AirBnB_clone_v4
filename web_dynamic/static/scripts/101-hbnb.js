$(() => {
  let checkedAmenities = [];
  const checkedLocations = {};
  const selectors = {
    amenitiesHeader: '.amenities > h4',
    amenityBox: '.amenities > .popover > ul > li > input[type="checkbox"]',
    amenityItem: '.amenities > .popover > ul > li',
    locationsHeader: '.locations > h4',
    reviewsHeader: '.reviews > .reviews-header > h3',
    reviewsList: '.reviews > .reviews-list'
  };

  function updateAmenitiesDisplay () {
    const amenitiesBody = checkedAmenities.map(obj => obj.name).join(', ');
    $(selectors.amenitiesHeader).html(
      checkedAmenities.length > 0 ? 'Checked Amenities: ' + amenitiesBody : '&nbsp;'
    );
  }

  function updateLocationsDisplay () {
    const locationsBody = Object.keys(checkedLocations).join(', ');
    $(selectors.locationsHeader).html(
      locationsBody !== '' ? 'Checked Locations: ' + locationsBody : '&nbsp;'
    );
  }

  $(selectors.amenityItem).on('change', function (ev) {
    const checkbox = $(this).find('input[type="checkbox"]');
    const id = checkbox.data('id');
    const name = checkbox.data('name');

    if (checkbox.is(':checked')) {
      checkedLocations[id] = name;
    } else {
      delete checkedLocations[id];
    }

    updateLocationsDisplay();
  });

  $(document).on('change', selectors.amenityBox, function (ev) {
    const amId = $(this).data('id');
    const amName = $(this).data('name');

    if ($(this).is(':checked')) {
      if (!checkedAmenities.find(obj => obj.id === amId)) {
        checkedAmenities.push({ id: amId, name: amName });
      }
    } else {
      checkedAmenities = checkedAmenities.filter(obj => obj.id !== amId);
    }

    updateAmenitiesDisplay();
  });

  function fetchPlaces () {
    const amenitiesIds = checkedAmenities.map(amenity => amenity.id);
    const locationIds = Object.keys(checkedLocations);

    fetch('http://0.0.0.0:5001/api/v1/places_search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amenities: amenitiesIds, cities: locationIds })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then(data => {
        $('.places').empty();

        data.forEach(place => {
          const article = `
              <article>
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                  <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div class="description">
                  ${place.description}
                </div>
              </article>
            `;
          $('.places').append(article);
        });
      })
      .catch(error => {
        console.error('Request error:', error);
      });
  }

  function fetchReviews () {
    fetch('http://0.0.0.0:5001/api/v1/reviews/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then(data => {
        $(selectors.reviewsList).empty();

        data.forEach(review => {
          const reviewElement = `
              <div class="review">
                <h4>${review.user}</h4>
                <p>${review.text}</p>
              </div>
            `;
          $(selectors.reviewsList).append(reviewElement);
        });
      })
      .catch(error => {
        console.error('Request error:', error);
      });
  }

  function toggleReviews () {
    const revHeader = $(selectors.reviewsHeader);
    const revList = $(selectors.reviewsList);

    if (revHeader.text() === 'Reviews') {
      revHeader.text('Reviews (hide)');
      fetchReviews();
      revList.show();
    } else {
      revHeader.text('Reviews');
      revList.empty().hide();
    }
  }

  function APIstats () {
    fetch('http://0.0.0.0:5001/api/v1/status/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 'OK') {
          $('#api_status').addClass('available');
          fetchPlaces();
        } else {
          $('#api_status').removeClass('available');
        }
      })
      .catch(error => {
        console.error('Request error:', error);
        $('#api_status').removeClass('available');
      });
  }

  APIstats();

  $('button').on('click', function () {
    fetchPlaces();
  });

  $(selectors.reviewsHeader).on('click', function () {
    toggleReviews();
  });
});
