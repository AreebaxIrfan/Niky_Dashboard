import client from './../../lib/sanityClient'
import { Review } from './../types/reviews';


export async function fetchReviews(): Promise<Review[]> {
    const query = `*[_type == 'review']{
      comment,
      phone,
      id,
      rating,
      email,
      product->{
        price,
        productName,
        category,
        image {
          asset-> {
            url,
          }
        }
      }
    }`;
  
    const reviews = await client.fetch(query);
        return reviews;
    }