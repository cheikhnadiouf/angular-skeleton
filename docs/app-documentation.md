# Angular 18+ Skeleton - Application Documentation

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Application Structure](#application-structure)
- [State Management](#state-management)
- [Routing System](#routing-system)
- [Component Architecture](#component-architecture)
- [Services & Data Flow](#services--data-flow)
- [Testing Strategy](#testing-strategy)
- [API Documentation](#api-documentation)

## Architecture Overview

This Angular 18+ application follows a modular architecture with reactive state management using signals and NGRX Signals.

```mermaid
graph TB
    A[App Module] --> B[Shared Module]
    A --> C[Pages Module]
    A --> D[Todos Module]
    
    B --> E[Services]
    B --> F[Components]
    
    C --> G[Home Component]
    C --> H[NGRX Component]
    C --> I[Not Found Component]
    
    D --> J[Todo Components]
    D --> K[Todo Services]
    D --> L[Todo Store]
    D --> M[Todo Models]
```

## Application Structure

### Module Organization

```mermaid
classDiagram
    class AppModule {
        +declarations: AppComponent[]
        +imports: Module[]
        +providers: Provider[]
        +bootstrap: AppComponent[]
    }
    
    class SharedModule {
        +forRoot() SharedModule
        +services: NotificationService, SpinnerService
    }
    
    class PagesModule {
        +routing: PagesRoutingModule
        +components: HomeComponent, NgrxComponent, NotFoundComponent
    }
    
    class TodosModule {
        +components: TodoComponent
        +services: TodoService
        +store: TodoStore
        +models: TodoInterface
    }
    
    AppModule --> SharedModule
    AppModule --> PagesModule
    AppModule --> TodosModule
```

### File Structure Hierarchy

```mermaid
graph LR
    A[src/app/] --> B[pages/]
    A --> C[shared/]
    A --> D[todos/]
    
    B --> E[home/]
    B --> F[ngrx/]
    B --> G[not-found/]
    
    C --> H[services/]
    
    D --> I[components/]
    D --> J[models/]
    D --> K[services/]
    D --> L[store/]
    D --> M[mocks/]
```

## State Management

The application uses NGRX Signals for reactive state management with a clean separation of concerns.

```mermaid
sequenceDiagram
    participant C as Component
    participant S as TodoStore
    participant M as TodoMethods
    participant API as TodoService
    
    C->>S: loadAllTodos()
    S->>M: withTodosMethods()
    M->>API: getItems()
    API-->>M: TodoInterface array
    M->>S: patchState with items
    S-->>C: items signal update
    C->>C: UI re-renders
```

### State Interface

```typescript
interface TodoState {
  items: TodoInterface[];
  currentTodo: Partial<TodoInterface>;
  error: boolean;
  errorMessage: string;
  success: boolean;
  loading: boolean;
}
```

## Routing System

```mermaid
graph TD
    A[App Routing] --> B[Pages Module]
    B --> C["/pages/home - HomeComponent"]
    B --> D["/pages/ngrx - NgrxComponent"]
    B --> E["/pages/notfound - NotFoundComponent"]
    B --> F["/** - Redirect to NotFound"]
    
    A --> G["/ - Redirect to Home"]
```

## Component Architecture

### Component Hierarchy

```mermaid
graph TB
    A[AppComponent] --> B[Router Outlet]
    B --> C[HomeComponent]
    B --> D[NgrxComponent]
    B --> E[NotFoundComponent]
    
    D --> F[TodoStoreComponent]
    F --> G[TodoComponent]
```

### Component Lifecycle

```mermaid
sequenceDiagram
    participant App as AppComponent
    participant Router as Angular Router
    participant Page as PageComponent
    participant Store as TodoStore
    
    App->>Router: Navigate to /pages/ngrx
    Router->>Page: Create NgrxComponent
    Page->>Store: Inject TodoStore
    Store->>Store: onInit - loadAllTodos
    Store-->>Page: items signal
    Page->>Page: Render UI with data
```

## Services & Data Flow

```mermaid
graph LR
    A[TodoService] --> B[HTTP Client]
    B --> C[Mock Backend]
    B --> D[Real API]
    
    A --> E[CRUD Operations]
    E --> F["getItems()"]
    E --> G["createItem()"]
    E --> H["updateItem()"]
    E --> I["deleteItem()"]
    
    A --> J[Error Handling]
    J --> K[HttpErrorResponse]
```

### Service Methods Flow

```mermaid
sequenceDiagram
    participant Store as TodoStore
    participant Service as TodoService
    participant HTTP as HttpClient
    participant Backend as API/Mock
    
    Store->>Service: getItems()
    Service->>HTTP: get TodoInterface array
    HTTP->>Backend: HTTP GET /todos
    Backend-->>HTTP: TodoInterface array
    HTTP-->>Service: Observable TodoInterface array
    Service-->>Store: Observable TodoInterface array
```

## Testing Strategy

### Test Architecture

```mermaid
graph TB
    A[Testing Strategy] --> B[Unit Tests - Jest]
    A --> C[E2E Tests - Cypress]
    A --> D[Component Tests]
    
    B --> E[Services Testing]
    B --> F[Component Logic Testing]
    B --> G[Store Testing]
    
    C --> H[User Flows]
    C --> I[Integration Testing]
    
    D --> J[Component Rendering]
    D --> K[User Interactions]
```

### Test Coverage Areas

```mermaid
pie title Test Coverage Distribution
    "Components" : 40
    "Services" : 30
    "Store/State" : 20
    "E2E Flows" : 10
```

## Data Models

### Entity Relationships

```mermaid
erDiagram
    BaseEntity {
        string id PK
        boolean active
    }
    
    TodoInterface {
        string id PK
        boolean active
        string value
        boolean done
    }
    
    TodoState {
        TodoInterface[] items
        TodoInterface currentTodo
        boolean error
        string errorMessage
        boolean success
        boolean loading
    }
    
    BaseEntity ||--|| TodoInterface : extends
    TodoState ||--o{ TodoInterface : contains
```

## Performance Considerations

### Optimization Strategy

```mermaid
graph LR
    A[Performance] --> B[OnPush Strategy]
    A --> C[Lazy Loading]
    A --> D[Signal-based State]
    A --> E[Tree Shaking]
    
    B --> F[Change Detection Optimization]
    C --> G[Module Code Splitting]
    D --> H[Reactive Updates]
    E --> I[Bundle Size Optimization]
```

## Development Workflow

```mermaid
gantt
    title Development Workflow
    dateFormat YYYY-MM-DD
    section Setup
        Install deps    :done, setup, 2024-01-01, 1d
        Setup configs   :done, config, after setup, 1d
    section Development
        Build components   :active, dev, after config, 5d
        Create services  :dev2, after config, 3d
        Setup NGRX       :dev3, after dev2, 2d
    section Testing
        Jest tests             :test, after dev, 2d
        Cypress E2E             :e2e, after test, 1d
    section Documentation
        API docs      :docs, after e2e, 1d
        User docs     :user-docs, after docs, 1d
```

## API Documentation

For detailed API documentation of all classes, interfaces, and methods, please refer to the auto-generated documentation:

📚 **[View Complete API Documentation](api/index.html)**

### Key API Endpoints

| Service | Method | Description |
|---------|--------|-------------|
| TodoService | `getItems()` | Fetch all todo items |
| TodoService | `createItem(todo)` | Create new todo item |
| TodoService | `updateItem(todo)` | Update existing todo item |
| TodoService | `deleteItem(todo)` | Delete todo item |

### Store Selectors

| Selector | Return Type | Description |
|----------|-------------|-------------|
| `items()` | `TodoInterface[]` | All todo items |
| `currentTodo()` | `Partial<TodoInterface>` | Currently selected todo |
| `loading()` | `boolean` | Loading state |
| `error()` | `boolean` | Error state |

---

*This documentation is automatically generated and updated. Last updated: $(date)*