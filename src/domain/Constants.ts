/**
 * Constant defining the styles for an unordered list
 */
export const UL_STYLE = "text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white";

/**
 * Constant defining the styles for a list item
 */
export const LI_STYLE = "w-full px-4 py-2 border-gray-200 dark:border-gray-600 overflow-hidden";

/**
 * Constant for the Pirate Bay search engine
 */
export const SE_PIRATEBAY = "piratebay";

/**
 * Constant for the YouTube search engine
 */
export const SE_YOUTUBE = "youtube";

/**
 * Enum defining HTTP status codes
 */
export enum StatusCodes {
  OK = 200, // Successful response with the requested data
  ACCEPTED = 202, // The server has received the request but has not yet processed it
  NO_CONTENT = 204, // The server has successfully fulfilled the request, but returns no content

  PARTIAL_CONTENT = 206, // The server is delivering only part of the resource due to a range header

  BAD_REQUEST = 400, // The server cannot or will not process the request due to a client error
  UNAUTHORIZED = 401, // Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not been provided
  FORBIDDEN = 403, // The client does not have access rights to the content
  NOT_FOUND = 404, // The server can't find the requested resource
  CONFLICT = 409, // Indicates that the request could not be processed because of conflict in the request
  UNPROCESSABLE_ENTITY = 422, // The server understands the content type of the request entity but was unable to process the contained instructions
  INTERNAL_SERVER_ERROR = 500, // A generic error message, given when an unexpected condition was encountered and no more specific message is suitable
  NOT_IMPLEMENTED=501, // The server either does not recognize the request method, or it lacks the ability to fulfill the request
}