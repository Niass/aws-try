import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleWare from '../lib/commonMiddleWare';
import createError from 'http-errors';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const {title} = event.body;
  const now = new Date();

  const auction = {
    id:uuid(),
    title,
    status:'OPEN',
    createdAt: now.toISOString(),
  };
  try {
    await dynamoDb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();

  } catch (e) {
    console.log(e);
    throw new createError.InternalServerError(e);
  }


  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleWare(createAuction);



