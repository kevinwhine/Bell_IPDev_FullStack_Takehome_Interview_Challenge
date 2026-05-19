Running Instructions
--------------------

I like trun the backend and front end in separate Terminal seesions to make any error output more obvious

DEVELOPMENT MODE Execution
To run the backend/server-side
CD .\apps\backend
NPM START

You should see output like:
    [Nest] 32900  - 19/05/2026, 10:04:12     LOG [RouterExplorer] Mapped {/api/store-name, GET} route +6ms
    [Nest] 32900  - 19/05/2026, 10:04:12     LOG [RouterExplorer] Mapped {/api/products, GET} route +2ms
    [Nest] 32900  - 19/05/2026, 10:04:12     LOG [RouterExplorer] Mapped {/api/wishlist, GET} route +0ms
    [Nest] 32900  - 19/05/2026, 10:04:12     LOG [RouterExplorer] Mapped {/api/wishlist/:id, POST} route +2ms
    [Nest] 32900  - 19/05/2026, 10:04:12     LOG [RouterExplorer] Mapped {/api/wishlist/:id, DELETE} route +1ms
    [Nest] 32900  - 19/05/2026, 10:04:12     LOG [NestApplication] Nest application successfully started +3ms
    Backend running on http://localhost:3000

To run the front-end/browser-side
CD .\apps\frontend
NPM RUN DEV

You should see output like:
      VITE v8.0.13  ready in 339 ms

      ➜  Local:   http://localhost:5173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help

Assumptions and Decisions:

- Not to use TDD Due to time constraints.
- Testing needed to be demonstrated.
- Needed to investigate and familarise with nest.js for HTTP request controllers and parameters
- Did not implement Schema validation of request or response bodies due to time contraints.
- Assumes that number of products was manageable for the browser-side without suspense/Promise wrapper
- No need for useTransition or useOptimize for state transitions eg Add wishlist item
- Product list small enough for client‑side filtering.
- I spent my time implement production fallbacks on Fetch and tests, not new features.  Phase 2 can be scheduled.

AI usage:
 - Used AI to ensure I did not miss a requirement.  Asked it to double check my todo list against your readme.
 - GitHub CoPilot autocomplete enabled.
 - Used CoPiLot to understand nest.js controllers and why   @Post('wishlist/:id') addToWishlist(@Param('id') id: ProductId) did not work
 - Used AI to do the minimal styling and to do the initial layout the Grid.

