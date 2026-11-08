import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

const userStorageKey = 'societysync_user';

export const societyContextInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(environment.apiUrl) || request.url.includes('/auth/')) {
    return next(request);
  }

  const storedUser = localStorage.getItem(userStorageKey) || sessionStorage.getItem(userStorageKey);
  if (!storedUser) {
    return next(request);
  }

  let societyId: number | undefined;
  try {
    const user = JSON.parse(storedUser);
    if (Number.isInteger(user?.societyId) && user.societyId > 0) {
      societyId = user.societyId;
    }
  } catch (error) {
    console.error('Unable to read the current society context.', error);
    return next(request);
  }

  if (!societyId) {
    return next(request);
  }

  if (request.method === 'GET' && !request.params.has('societyId')) {
    return next(request.clone({ params: request.params.set('societyId', societyId) }));
  }

  if (request.method === 'DELETE' && !request.params.has('societyId')) {
    return next(request.clone({ params: request.params.set('societyId', societyId) }));
  }

  const body = request.body as Record<string, unknown> | null;
  if (['POST', 'PUT', 'PATCH'].includes(request.method)
      && body !== null
      && typeof body === 'object'
      && !(body instanceof FormData)
      && body.societyId == null) {
    return next(request.clone({ body: { ...body, societyId } }));
  }

  return next(request);
};
