const calculateFare = ({ distanceKm = 0, durationMinutes = 0 }) => {
  const baseFare = 50;
  const pricePerKm = 15;
  const pricePerMinute = 2;

  const fare = baseFare + (distanceKm * pricePerKm) + (durationMinutes * pricePerMinute);
  return Number(fare.toFixed(2));
};

module.exports = {
  calculateFare,
};
