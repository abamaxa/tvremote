export const UL_STYLE = "text-sm font-medium text-gray-900 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white";
export const LI_STYLE = "w-full px-4 py-2 border-gray-200 dark:border-gray-600 overflow-hidden";

export const SE_PIRATEBAY = "piratebay";
export const SE_YOUTUBE = "youtube";


export enum StatusCodes {
  OK = 200,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  PARTIAL_CONTENT = 206,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED=501,
}
