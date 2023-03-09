class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // const query = await Tour.find({
    //   duration: req.query.duration,
    //   difficulty: req.query.difficulty,
    // });
    // Build a Query
    // 1) Filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced Filterings
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // {duration: { $gte : 5}}
    // {duration: { gte : 5}}
    // gte, gt, lte, lt

    this.query.find(JSON.parse(queryStr));

    // We need to return object to use it in the main function
    // this means it returns entire object
    return this;
  }

  sort() {
    // 3) Sorting
    if (this.queryString.sort) {
      // console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  limit() {
    // 4) Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    // 5) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    /* it Won't work here because it returns objects */
    // if (this.queryString.page) {
    //   const numTours = Tour.countDocuments();
    //   if (skip > numTours) {
    //     throw new Error('This page is does not contain any documents');
    //   }
    // }

    return this;
  }
}

module.exports = APIFeatures;
