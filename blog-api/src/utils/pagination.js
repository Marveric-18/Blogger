/**
 * Pagination Function
 * @param model{Mongoose Model} - The mongoose model used to fetch data.
 * @param baseQuery{Object} - Query to use to fetch on Mongoose model
 * @param page{Number} - Number of page requested
 * @param limit {Number} - Number of limit of records to be fetched in one page
 * @param minDays {Number} - To fetch records from now to Minimum days before. [Now - MinDays , Now]
 * @param daysStep {Number} - If limit not found in minDays then increase the range [Noe - MinDays -daysStep, Now]
 * @param dateField {String} - Date Field name which will be used in filter
 * @param sort {Object} - Sort Query. 
 */
const paginateWithDateFallback = async ({
    model,
    baseQuery = {},
    page = 1,
    limit = 10,
    minDays = 60,
    daysStep = 30,
    dateField = 'createdAt',
    sort = { createdAt: -1 }
  }) => {
    const skip = (page - 1) * limit;
    const totalCount = await model.countDocuments(baseQuery);
  
    let date = new Date();
    date.setDate(date.getDate() - minDays);
  
    let query = {
      ...baseQuery,
      [dateField]: { $gte: date },
    };
  
    let countDoc = await model.countDocuments(query);
  
    while (countDoc < limit && countDoc < totalCount) {
      date.setDate(date.getDate() - daysStep);
      query[dateField] = { $gte: date };
      countDoc = await model.countDocuments(query);
    }
  
    const documents = await model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  
    return {
      data: documents,
      page,
      limit,
      fromDate: date,
      totalMatching: countDoc,
      totalCount,
      totalPages: Math.ceil(countDoc / limit),
    };
  };

  
export default paginateWithDateFallback;