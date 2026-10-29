USE CFS;
GO

IF OBJECT_ID(N'dbo.Memories', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Memories (
        Id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT PK_Memories PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        MemoryDate DATE NULL,
        People NVARCHAR(500) NULL,
        Location NVARCHAR(200) NULL,
        Tags NVARCHAR(500) NULL,
        Content NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Memories_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Memories_UpdatedAt DEFAULT SYSUTCDATETIME()
    );
END;
GO

IF OBJECT_ID(N'dbo.Stories', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Stories (
        Id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT PK_Stories PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Tone NVARCHAR(40) NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        SourceMemoryId UNIQUEIDENTIFIER NULL,
        CreatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Stories_CreatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Stories_Memories
            FOREIGN KEY (SourceMemoryId)
            REFERENCES dbo.Memories(Id)
            ON DELETE SET NULL
    );
END;
GO

IF OBJECT_ID(N'dbo.Remembrances', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Remembrances (
        Id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT PK_Remembrances PRIMARY KEY,
        PersonName NVARCHAR(200) NOT NULL,
        Relationship NVARCHAR(100) NULL,
        Biography NVARCHAR(MAX) NULL,
        FavoriteThings NVARCHAR(MAX) NULL,
        Message NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL
            CONSTRAINT DF_Remembrances_CreatedAt DEFAULT SYSUTCDATETIME()
    );
END;
GO

CREATE INDEX IX_Memories_MemoryDate
    ON dbo.Memories(MemoryDate DESC);

CREATE INDEX IX_Stories_CreatedAt
    ON dbo.Stories(CreatedAt DESC);
GO


INSERT INTO dbo.Memories
    (Id, Title, MemoryDate, People, Location, Tags, Content)
VALUES
(
    NEWID(),
    N'The Haunted House',
    '2020-10-31',
    N'Grandmother',
    N'Mumbai',
    N'ghost, childhood',
    N'I remember visiting an old house where the hallway clock stopped at midnight.'
);
GO

SELECT Id, Title, MemoryDate
FROM dbo.Memories;