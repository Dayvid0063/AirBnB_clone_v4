$(() => {
    let checkedAmenities = [];
    const selectors = {
      amenitiesHeader: '.amenities > h4',
      amenityBox: '.amenities > .popover > ul > li > input[type="checkbox"]',
      amenityItem: '.amenities > .popover > ul > li'
    };
  
    function updateDisplay () {
      const body = checkedAmenities.map(obj => obj.name).join(', ');
      $(selectors.amenitiesHeader).html(
        checkedAmenities.length > 0 ? 'Checked Amenities: ' + body : '&nbsp;'
      );
    }
  
    $(selectors.amenityItem).on('mousedown', function (ev) {
      const checkbox = $(this).find('input[type="checkbox"]');
      checkbox.prop('checked', !checkbox.prop('checked')).change();
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
  
      updateDisplay();
    });
  
    function fetchPlaces () {
      fetch('http://0.0.0.0:5001/api/v1/places_search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
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
  });
  