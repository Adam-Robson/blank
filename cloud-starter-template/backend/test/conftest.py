# Configuration for pytest fixtures and plugins
from collections.abc import AsyncIterator, Iterator

import httpx
import pytest


def _default_handler(request: httpx.Request) -> httpx.Response:
    return httpx.Response(200, json={})


@pytest.fixture
def http_transport() -> httpx.MockTransport:
    '''Override in a test module to stub specific responses.'''
    return httpx.MockTransport(_default_handler)


@pytest.fixture
def http_client(
    http_transport: httpx.MockTransport,
) -> Iterator[httpx.Client]:
    with httpx.Client(
        transport=http_transport, base_url='http://testserver'
    ) as client:
        yield client


@pytest.fixture
async def async_http_client(
    http_transport: httpx.MockTransport,
) -> AsyncIterator[httpx.AsyncClient]:
    async with httpx.AsyncClient(
        transport=http_transport, base_url='http://testserver'
    ) as client:
        yield client
