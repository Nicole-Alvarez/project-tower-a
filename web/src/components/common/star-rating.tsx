import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating = ({ rating, totalStars = 5 }: StarRatingProps) => {
    const stars = Array.from({ length: totalStars }, (_, index) => {
    const starRating = index + 1;
    if (rating >= starRating) return <FaStar key={index} size={14} className="text-[#E0F02B]" />;
    if (rating >= starRating - 0.5) return <FaStarHalfAlt key={index} size={14} className="text-[#E0F02B]" />;
    return <FaRegStar key={index} size={14} className="text-[#E0F02B]" />;
  });

  return <div className="flex flex-row space-x-1">{stars}</div>;
};

export default StarRating;
