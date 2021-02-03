SELECT reservations.*, properties.*, AVG(rating) AS "average_rating"
FROM reservations
JOIN properties ON reservations.property_id=properties.id
JOIN property_reviews ON properties.id=property_reviews.property_id
WHERE reservations.guest_id = 5 AND reservations.end_date < now()::DATE
GROUP BY reservations.id, properties.id
ORDER BY properties.cost_per_night
LIMIT 10;