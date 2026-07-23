export const beneficiariesQuery = `
  *[_type == "beneficiary" && pagedVerified == true && status != "withdrawn"] | order(publishedAt desc) {
    _id,
    displayName,
    location,
    country,
    shortStory,
    story,
    photo,
    status,
    fundingGoal,
    fundingProgress,
    linkedScarfShopifyId,
    searchKeywords,
    publishedAt,
    fundedAt
  }
`

export const beneficiariesByScarfIdQuery = `
  *[_type == "beneficiary" && linkedScarfShopifyId == $scarfId && pagedVerified == true && status != "withdrawn"] {
    _id,
    displayName,
    location,
    country
  }
`

export const beneficiaryByIdQuery = `
  *[_type == "beneficiary" && _id == $id && pagedVerified == true && status != "withdrawn"][0] {
    _id,
    displayName,
    location,
    country,
    shortStory,
    story,
    photo,
    status,
    fundingGoal,
    fundingProgress,
    linkedScarfShopifyId,
    searchKeywords,
    publishedAt,
    fundedAt
  }
`
