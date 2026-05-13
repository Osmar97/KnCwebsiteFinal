// Placeholder — this directory exists only to host automated storage policy tests
// (see storage_policy_test.ts). It is not intended to be invoked as an HTTP function.
Deno.serve(() => new Response("storage-policy-tests: tests-only", { status: 404 }));