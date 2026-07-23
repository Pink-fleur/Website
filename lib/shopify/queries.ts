export const PRODUCT_CORE_FRAGMENT = `
  fragment ProductCoreFragment on Product {
    id
    handle
    title
    description
    productType
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    images(first: 5) {
      nodes { url altText width height }
    }
    variants(first: 10) {
      nodes {
        id
        title
        price { amount currencyCode }
        availableForSale
        quantityAvailable
      }
    }
  }
`

export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_CORE_FRAGMENT}
  query GetProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      nodes { ...ProductCoreFragment }
      pageInfo { hasNextPage endCursor }
    }
  }
`

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_CORE_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductCoreFragment }
  }
`

export const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors { field message }
    }
  }
`
