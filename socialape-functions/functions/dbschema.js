let db = {
  users: [
    {
      userId: "dasfsdfnsdlkvnld",
      email: "user@email.com",
      handle: "user",
      createdAt: "2020-03-11T09:49:24.037Z",
      imageUrl: "image/dsfsdfarsdfsd/fsdafs",
      bio: "Hello, my name is user, nice to meet you",
      website: "https://user.com",
      location: "London, UK"
    }
  ],
  screams: [
    {
      userHandle: "user",
      body: "this is the scream body",
      createdAt: "2020-03-11T09:49:24.037Z",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "user",
      screamId: "kdjsfgdksuufhgkdsufky",
      body: "nice one mate!",
      createdAt: "2019-03-15T10:59:52.798Z"
    }
  ]
};

const userDetails = {
  // Redux data
  credentials: {
    userId: "N43KJ5H43KJHREW4J5H3JWMERHB",
    email: "user@email.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image/dsfsdkfghskdfgs/dgfdhfgdh",
    bio: "Hello, my name is user, nice to meet you",
    website: "https://user.com",
    location: "Lonodn, UK"
  },
  likes: [
    {
      userHandle: "user",
      screamId: "hh7O5oWfWucVzGbHH2pa"
    },
    {
      userHandle: "user",
      screamId: "3IOnFoQexRcofs5OhBXO"
    }
  ]
};
