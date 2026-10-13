import { ApolloServer } from "@apollo/server";
import { answerPropertyQuestion } from "./agent";
import { Criteria, searchProperties } from "./propertySearch";
const typeDefs = `#graphql
input PropertySearchInput {
  city:String locality:String minPrice:Float maxPrice:Float bedrooms:Int
  minBedrooms:Int maxBedrooms:Int propertyType:String minAreaSqft:Float maxAreaSqft:Float
}
type Property {
  id:ID! title:String! city:String! locality:String address:String price:String!
  bedrooms:Int bathrooms:Int areaSqft:Int propertyType:String! status:String!
  description:String imageUrl:String
}
type PropertySearchResult { count:Int! properties:[Property!]! }
type Query {
  searchProperties(criteria:PropertySearchInput!):PropertySearchResult!
  askPropertyAssistant(message:String!):String!
}`;
export const apollo = new ApolloServer({
  typeDefs,
  resolvers: { Query: {
    searchProperties: async (_:unknown,args:{criteria:Criteria}) => {
      const properties = await searchProperties(args.criteria);
      return {count:properties.length,properties};
    },
    askPropertyAssistant: async (_:unknown,args:{message:string}) => answerPropertyQuestion(args.message)
  }}
});
