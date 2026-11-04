from collections.abc import Mapping
from dataclasses import dataclass
from typing import Self

DEFAULT_CORS_ORIGINS = 'http://localhost:5173,http://localhost:3000'


@dataclass(frozen=True)
class Settings:
    '''Runtime configuration, read from the environment (12-factor).'''

    cors_origins: tuple[str, ...]
    port: int

    @classmethod
    def from_env(cls, environ: Mapping[str, str]) -> Self:
        origins = environ.get('CORS_ORIGINS', DEFAULT_CORS_ORIGINS)
        return cls(
            cors_origins=tuple(
                origin.strip() for origin in origins.split(',') if origin
            ),
            port=int(environ.get('PORT', '8080')),
        )
