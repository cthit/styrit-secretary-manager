## How to use the secretary manager program

Begin by getting sending the code to `/code` with the following json data.
```json
{
    "code": "some_code" // Ex 123123
}
```

If the code is correct this should return the following data:

```json
{
    "code": "some_code", // Ex 123123
    "group": "some_group", // Ex armit
    "tasks": {
      "display_name_for_task_1": "code_name_for_task_1", // Ex "Verksamhetsrapport": "vrapport"   
      "display_name_for_task_2": "code_name_for_task_2"
    }
}
```

Now make sure to get one (pdf) document for each of the given tasks in the dictionary above.